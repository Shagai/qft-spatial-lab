"""Rebuild the neutron interferometer as a self-contained glTF binary.

    blender --background --python scripts/build-interferometer.py

Dimensions below are in the exported Y-up coordinate system. X follows the
incoming neutron beam and the near arm is on the positive Z side of the table.
"""
from math import atan2, cos, pi, sin
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / "public/models/interferometer.glb"
BEAM_HEIGHT = 0.53

bpy.ops.wm.read_factory_settings(use_empty=True)


def material(name, color, metallic=0, roughness=0.42, glow=0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = roughness
    if glow:
        shader.inputs["Emission Color"].default_value = (*color, 1)
        shader.inputs["Emission Strength"].default_value = glow
    return mat


# Linear RGB. The moderately metallic coatings stay legible in a directly lit scene.
graphite = material("Hard anodised graphite", (0.085, 0.114, 0.137), 0.48)
slate = material("Ground slate table surface", (0.125, 0.159, 0.176), 0.38, 0.55)
edge = material("Brushed titanium", (0.31, 0.383, 0.403), 0.55, 0.31)
charcoal = material("Black oxide steel", (0.026, 0.039, 0.05), 0.35)
rubber = material("Isolation rubber", (0.014, 0.022, 0.028), 0.02, 0.78)
brass = material("Pale machined brass", (0.57, 0.355, 0.146), 0.65, 0.31)
copper = material("Copper magnet wire", (0.76, 0.265, 0.091), 0.55, 0.30)
teal = material("Verdigris magnet wire", (0.064, 0.45, 0.414), 0.42, 0.30)
ceramic = material("Pale instrument ceramic", (0.47, 0.54, 0.53), 0.20, 0.40)
crystal = material("Smoky blue silicon", (0.17, 0.345, 0.407), 0.48, 0.20)
crystal_edge = material("Polished silicon edge", (0.456, 0.70, 0.734), 0.47, 0.23)
indicator = material("Jade status lens", (0.068, 0.65, 0.475), 0.18, 0.31, 0.65)


def blender_axis(point):
    return (point[0], -point[2], point[1])


class Assembly:
    """One named, independently transformable glTF node with local mesh geometry."""

    def __init__(self, name, origin=(0, 0, 0)):
        self.name = name
        self.origin = Vector(origin)
        self.verts = []
        self.faces = []
        self.face_materials = []
        self.materials = []

    def vertex(self, coords):
        self.verts.append(blender_axis(Vector(coords) - self.origin))
        return len(self.verts) - 1

    def face(self, indices, mat):
        if mat not in self.materials:
            self.materials.append(mat)
        self.faces.append(indices)
        self.face_materials.append(self.materials.index(mat))

    def finish(self):
        mesh = bpy.data.meshes.new(self.name + " mesh")
        mesh.from_pydata(self.verts, [], self.faces)
        for mat in self.materials:
            mesh.materials.append(mat)
        mesh.polygons.foreach_set("material_index", self.face_materials)
        mesh.polygons.foreach_set("use_smooth", [True] * len(mesh.polygons))
        mesh.update()
        mesh.set_sharp_from_angle(angle=0.63)
        obj = bpy.data.objects.new(self.name, mesh)
        bpy.context.collection.objects.link(obj)
        obj.location = blender_axis(self.origin)
        return obj


def join_rings(group, first, second, mat):
    for index in range(len(first)):
        following = (index + 1) % len(first)
        group.face((first[index], first[following], second[following], second[index]), mat)


def panel(group, center, size, mat, corner=0.035, bevel=0.01, yaw=0):
    """Milled plate with horizontal corner clips and bevels around both faces."""
    x, y, z = center
    hx, hy, hz = (length * 0.5 for length in size)
    bevel = min(bevel, hx * 0.30, hy * 0.45, hz * 0.30)
    rings = []
    for scale, elevation in [(bevel, -hy), (0, -hy + bevel), (0, hy - bevel), (bevel, hy)]:
        a = hx - scale
        b = hz - scale
        c = min(corner, a * 0.65, b * 0.65)
        # When viewed from above (+Y), the winding is anticlockwise.
        outline = [(-a+c, -b), (-a, -b+c), (-a, b-c), (-a+c, b),
                   (a-c, b), (a, b-c), (a, -b+c), (a-c, -b)]
        ring = [group.vertex((x + u*cos(yaw) - v*sin(yaw), y + elevation,
                              z + u*sin(yaw) + v*cos(yaw))) for u, v in outline]
        rings.append(ring)
    group.face(rings[0][::-1], mat)
    for start, end in zip(rings, rings[1:]):
        join_rings(group, start, end, mat)
    group.face(rings[-1], mat)


def radial_profile(group, start, end, profile, mat, sides, close_ends=True):
    """Lathe a cross section around any axis, optionally closing the profile itself."""
    start, end = Vector(start), Vector(end)
    axis = end - start
    direction = axis.normalized()
    guide = Vector((0, 1, 0)) if abs(direction.y) < 0.9 else Vector((0, 0, 1))
    u = direction.cross(guide).normalized()
    v = direction.cross(u).normalized()
    circle = [u*cos(2*pi*i/sides) + v*sin(2*pi*i/sides) for i in range(sides)]
    rings = [[group.vertex(start + fraction * axis + radius * vec) for vec in circle]
             for fraction, radius in profile]
    for first, second in zip(rings, rings[1:]):
        join_rings(group, first, second, mat)
    if close_ends:
        group.face(rings[0][::-1], mat)
        group.face(rings[-1], mat)
    else:
        join_rings(group, rings[-1], rings[0], mat)


def cylinder(group, start, end, radius, mat, sides=20, rim=0):
    distance = (Vector(end) - Vector(start)).length
    rim = min(rim, radius * 0.25, distance * 0.33)
    profile = [(0, radius), (1, radius)]
    if rim > 0:
        t = rim / distance
        profile = [(0, radius-rim), (t, radius), (1-t, radius), (1, radius-rim)]
    radial_profile(group, start, end, profile, mat, sides)


def sleeve(group, start, end, outer, inner, mat, sides=32):
    radial_profile(group, start, end, [(0, outer), (1, outer), (1, inner), (0, inner)],
                   mat, sides, close_ends=False)


def vertical(group, x, z, lo, hi, radius, mat, sides=16, rim=0):
    cylinder(group, (x, lo, z), (x, hi, z), radius, mat, sides, rim)


def screw(group, x, y, z, radius=0.032):
    vertical(group, x, z, y, y+0.010, radius, edge, 12)
    vertical(group, x, z, y+0.010, y+0.011, radius*0.48, charcoal, 6)


def make_table():
    table = Assembly("Optical table")
    panel(table, (0, -0.239, 0), (7.03, 0.124, 2.76), charcoal, 0.21, 0.026)
    panel(table, (0, -0.151, 0), (7.30, 0.115, 2.91), graphite, 0.20, 0.018)
    panel(table, (0, -0.101, 0), (7.33, 0.026, 2.94), edge, 0.20, 0.007)
    panel(table, (0, -0.05, 0), (7.36, 0.100, 2.96), slate, 0.20, 0.016)
    for x in (-3.12, 3.12):
        for z in (-1.06, 1.06):
            vertical(table, x, z, -0.325, -0.28, 0.20, rubber, 24, 0.008)
    for side in (-1, 1):
        # Slightly recessed longitudinal registration strips.
        panel(table, (0, 0.002, side*1.36), (6.79, 0.005, 0.020), charcoal, 0.008)
        for x in (-3.41, 3.41):
            screw(table, x, 0.002, side*1.24, 0.044)
    table.finish()

    # Flush threaded sockets, merged in one two-material mesh for rendering.
    sockets = Assembly("Breadboard threaded sockets")
    for i in range(-10, 11):
        for j in range(-4, 5):
            x, z = i*0.327, j*0.30
            if ((abs(x) > 2.66 and abs(z) < 0.97)
                or (abs(abs(x)-1.2) < 0.25 and abs(abs(z)-0.95) < 0.22)
                or (abs(x) < 0.5 and abs(abs(z)-0.95) < 0.24)):
                continue
            rings = []
            for radius, y in [(0.018, 0.0012), (0.0115, 0.0014)]:
                rings.append([sockets.vertex((x + radius*cos(2*pi*k/8), y,
                                              z - radius*sin(2*pi*k/8))) for k in range(8)])
            join_rings(sockets, rings[0], rings[1], graphite)
            sockets.face(rings[1], charcoal)
    sockets.finish()


def make_crystal(name, x, z, yaw, size):
    stage = Assembly(name, (x, 0, z))
    panel(stage, (x, 0.032, z), (size+0.095, 0.064, 0.25), graphite, 0.048, 0.009, yaw)
    panel(stage, (x, 0.102, z), (size*0.66, 0.095, 0.13), edge, 0.026, 0.014, yaw)
    panel(stage, (x, 0.192, z), (size*0.80, 0.108, 0.09), charcoal, 0.018, 0.012, yaw)
    panel(stage, (x, 0.437, z), (size, 0.39, 0.049), crystal, 0.018, 0.009, yaw)
    panel(stage, (x, 0.633, z), (size-0.015, 0.008, 0.040), crystal_edge, 0.010, 0.002, yaw)
    # Two dull brass retaining blocks hold the crystal below the beam plane.
    for side in (-1, 1):
        u = size*0.34*side
        cx, cz = x + u*cos(yaw), z + u*sin(yaw)
        panel(stage, (cx, 0.261, cz), (0.058, 0.040, 0.093), brass, 0.013, 0.006, yaw)
    stage.finish()


def coil(name, z, enamel):
    frame = Assembly(name+" support", (0, 0, z))
    panel(frame, (0, 0.034, z), (0.97, 0.068, 0.56), graphite, 0.069, 0.011)
    for x in (-0.365, 0.365):
        panel(frame, (x, 0.104, z), (0.15, 0.080, 0.432), edge, 0.030, 0.011)
        for side in (-1, 1):
            cylinder(frame, (x, 0.13, z+side*0.16), (x, 0.36, z+side*0.235),
                     0.047, graphite, 12)
        sleeve(frame, (x-0.029, BEAM_HEIGHT, z), (x+0.029, BEAM_HEIGHT, z),
               0.317, 0.269, edge)
        for side in (-1, 1):
            screw(frame, x, 0.069, z+side*0.222, 0.021)
    # Twin external tie rods brace the bobbin while leaving its upper side open.
    for side in (-1, 1):
        pz = z + side*0.256
        cylinder(frame, (-0.413, 0.394, pz), (0.413, 0.394, pz), 0.020, charcoal, 14)
        cylinder(frame, (0.398, 0.394, pz), (0.425, 0.394, pz), 0.030, brass, 6)
    frame.finish()

    winding = Assembly(name+" winding", (0, BEAM_HEIGHT, z))
    # An open helical winding leaves the horizontal beam visible between turns.
    turns, segments, wire_sides = 4.75, 118, 7
    rings = []
    for i in range(segments + 1):
        t = i / segments
        angle = 2*pi*turns*t + pi
        radial = Vector((0, cos(angle), sin(angle)))
        tangent = Vector((0.664, -0.286*2*pi*turns*sin(angle),
                          0.286*2*pi*turns*cos(angle))).normalized()
        cross = tangent.cross(radial).normalized()
        center = Vector((-0.332+t*0.664, BEAM_HEIGHT, z)) + radial*0.286
        rings.append([winding.vertex(center + 0.023*(radial*cos(2*pi*j/wire_sides)
                                                      + cross*sin(2*pi*j/wire_sides)))
                      for j in range(wire_sides)])
    for first, second in zip(rings, rings[1:]):
        join_rings(winding, first, second, enamel)
    winding.face(rings[0][::-1], enamel)
    winding.face(rings[-1], enamel)
    winding.finish()


def source():
    x = -3.20
    body = Assembly("Neutron source and collimator", (x, 0, 0))
    panel(body, (x, 0.040, 0), (0.75, 0.080, 0.66), graphite, 0.080, 0.012)
    panel(body, (x-0.025, 0.20, 0), (0.39, 0.27, 0.302), edge, 0.048, 0.023)
    panel(body, (x-0.060, 0.40, 0), (0.58, 0.30, 0.50), charcoal, 0.071, 0.037)
    panel(body, (x-0.065, 0.525, 0), (0.50, 0.305, 0.47), ceramic, 0.071, 0.027)
    for xx in (-3.38, -3.31, -3.24):
        panel(body, (xx, 0.680, 0), (0.024, 0.009, 0.32), graphite, 0.006, 0.002)
    for near_x, far_x, r, mat in [(-3.038, -2.984, 0.171, edge),
                                  (-2.991, -2.948, 0.135, charcoal),
                                  (-2.950, -2.915, 0.113, brass)]:
        sleeve(body, (near_x, BEAM_HEIGHT, 0), (far_x, BEAM_HEIGHT, 0), r, r*0.62, mat, 32)
    cylinder(body, (-2.990, BEAM_HEIGHT, 0), (-2.979, BEAM_HEIGHT, 0), 0.085, rubber)
    for side in (-1, 1):
        screw(body, x-0.24, 0.080, side*0.245)
    body.finish()


def detector(name, sign, accent):
    # Its axis follows the outgoing ray from the analyser to the port.
    yaw = atan2(sign*0.45, 0.60)
    cx, cz = 3.167, sign*0.613

    def at(u, y, v=0):
        return (cx + u*cos(yaw) - v*sin(yaw), y, cz + u*sin(yaw) + v*cos(yaw))

    head = Assembly(name, (cx, 0, cz))
    panel(head, at(0, 0.034), (0.64, 0.068, 0.39), graphite, 0.042, 0.011, yaw)
    panel(head, at(0.005, 0.180), (0.24, 0.236, 0.18), edge, 0.026, 0.015, yaw)
    panel(head, at(0.024, 0.366), (0.38, 0.16, 0.25), charcoal, 0.036, 0.020, yaw)
    panel(head, at(0.055, 0.526), (0.45, 0.258, 0.31), graphite, 0.044, 0.025, yaw)
    panel(head, at(0.085, 0.658), (0.33, 0.014, 0.222), edge, 0.025, 0.004, yaw)
    panel(head, at(0.17, 0.669), (0.043, 0.012, 0.114), accent, 0.012, 0.003, yaw)
    sleeve(head, at(-0.270, BEAM_HEIGHT), at(-0.228, BEAM_HEIGHT), 0.121, 0.088, brass, 24)
    sleeve(head, at(-0.228, BEAM_HEIGHT), at(-0.155, BEAM_HEIGHT), 0.132, 0.083, charcoal, 24)
    cylinder(head, at(-0.163, BEAM_HEIGHT), at(-0.155, BEAM_HEIGHT), 0.084, rubber, 24)
    for v in (-0.135, 0.135):
        p = at(0.201, 0.069, v)
        screw(head, *p, radius=0.018)
    head.finish()


make_table()
make_crystal("Entrance beam splitter", -2.35, 0, 0.90, 0.49)
make_crystal("Exit analyser", 2.35, 0, -0.90, 0.49)
for z, label, color in [(-0.95, "upper", teal), (0.95, "lower", copper)]:
    for x, station in [(-1.2, "entrance"), (1.2, "exit")]:
        sign = (1 if z > 0 else -1) * (1 if x < 0 else -1)
        make_crystal(f"{label.capitalize()} {station} deflector", x, z, sign*0.35, 0.35)
    coil(label.capitalize()+" field coil", z, color)
source()
detector("Upper neutron detector", -1, indicator)
detector("Lower neutron detector", 1, copper)

DESTINATION.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(DESTINATION), export_format="GLB", export_yup=True,
                          export_cameras=False, export_lights=False, export_animations=False,
                          export_texcoords=False, export_normals=True, export_materials="EXPORT")
print(f"Interferometer: {DESTINATION.stat().st_size:,} bytes in {len(bpy.context.scene.objects)} assemblies.")
