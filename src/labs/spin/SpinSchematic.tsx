import { Quaternion, Vector3 } from 'three'
import { armRotation } from './spinModel'

interface Props {
  angle: number
  progress: number
  reversed: boolean
  overlay: boolean
}

export default function SpinSchematic({ angle, progress, reversed, overlay }: Props) {
  return (
    <svg className="spin-schematic" viewBox="0 0 660 290" role="img" aria-label="Live beam schematic with two spatial orientation frames, a source at left and detectors A and B at right">
      <g strokeLinejoin="round" strokeLinecap="round" fill="none" strokeWidth="4">
        <path d="M 57 156 H 115" stroke="#cfdae1" />
        <path d="m 115 156 73 -59 h 251 l 75 59" stroke="#69f5df" />
        <path d="m 115 156 73 60 h 251 l 75 -60" stroke="#ffba64" />
        <path d="m 514 156 49 -28 h 37 m -86 28 49 28 h 37" stroke="#b7cedb" />
      </g>
      <g fill="#2a404a" stroke="#96aeb9" strokeWidth="2">
        <rect x="31" y="142" width="33" height="29" rx="4" />
        <path d="m 104 159 18 -16 6 7 -18 16 z m 398 0 18 -16 6 7 -18 16 z" />
        <rect x="587" y="114" width="30" height="28" rx="4" /><rect x="587" y="170" width="30" height="28" rx="4" />
      </g>
      <g textAnchor="middle" fill="#eaf5f5" fontFamily="monospace" fontSize="17"><text x="602" y="134">A</text><text x="602" y="190">B</text></g>
      {[false, true].map((lower, i) => {
        const [w, x, y, z] = armRotation(angle, progress, reversed && lower)
        const rotation = new Quaternion(x, y, z, w)
        const cy = overlay ? 153 : lower ? 190 : 76
        return <g key={i}>
          <text x="199" y={lower ? 243 : 82} fill={lower ? '#ffba64' : '#69f5df'} fontFamily="monospace" fontSize="19">{lower && reversed ? 'Y → X' : 'X → Y'}</text>
          {['x', 'y', 'z'].map((axis, j) => {
            const d = new Vector3(Number(j === 0), Number(j === 1), Number(j === 2)).applyQuaternion(rotation)
            const scale = overlay && lower ? 52 : 39
            const dx = scale * (d.x - d.z * 0.57)
            const dy = scale * (-d.y - d.z * 0.43)
            const color = ['#ff818b', '#81e5b0', '#8cbaff'][j]
            return <g key={axis} transform={`translate(345 ${cy})`}>
              <line x2={dx} y2={dy} stroke={color} strokeWidth={lower ? 2 : 3.5} strokeLinecap="round" />
              <circle cx={dx} cy={dy} r="2.8" fill={color} />
              <text x={dx * 1.14} y={dy * 1.14} dominantBaseline="middle" textAnchor="middle" fill={color} fontFamily="monospace" fontSize="12">{axis}</text>
            </g>
          })}
          <circle cx="345" cy={cy} r="4" fill={lower ? '#ffba64' : '#69f5df'} />
        </g>
      })}
    </svg>
  )
}
