# QFT Spatial Lab

[Open the spinor interferometer](https://shagai.github.io/qft-spatial-lab/#/labs/spinor) · [Open the field-mode lab](https://shagai.github.io/qft-spatial-lab/#/labs/field-modes)

Two interactive experiments inside the [QFT Learning Notebook](https://github.com/Shagai/quantum_field_theory_learning). The demo is an independent copy with the notebook’s original Git history. The chapter readings are available under **Notebook**; each relevant derivation also contains an inline version of its lab.

## Run the experiments

**Spinor interferometer.** Each arm contains an idealized spin rotator that applies two successive pulses about fixed laboratory axes. Choose the pulse order and rotation angle, then compare the frames. Predict which detector will be brighter and send 100 spin-½ neutrons through the ideal balanced interferometer. In the same-order control all neutrons arrive at A. With two reversed half-turns they all arrive at B. At 90° and full progress the expected A fraction is 0.75; individual batches fluctuate. Replay and scrub let you inspect intermediate transformations. Open the derivation to connect the counts to the overlap of the output spin states.

**Field modes.** Prepare a normalized one-particle state on a 64-site periodic lattice. Change the momentum bandwidth, translate the packet, and scramble its phases while watching the Fourier amplitudes and site probabilities. Switch to **Single oscillator** to prepare the vacuum or a one-quantum number state and accumulate quadrature measurements from independently prepared copies.

## Development

Use Node.js 24 and npm. From the repository root:

```sh
npm ci
npm run dev
```

```sh
npm test
npm run lint
npm run build
npm run preview
```

For browser checks, build once and run `CHROME_PATH=/path/to/chrome npm run test:browser`. CI checks the WebGL apparatus at desktop and phone widths and retains screenshots.

The original Pages workflow builds and deploys pushes to main. The build also runs the physics tests. Vite infers the repository base path in GitHub Actions; hash routing supports direct experiment links.

## 3D and immersive mode

The interferometer uses Three.js and a self-contained Blender-built optical bench. The in-page experiment supports mouse, keyboard controls and touch. A WebGL fallback keeps the experiment usable on devices without hardware rendering. A browser with immersive WebXR support and an HTTPS connection can enter VR. Aim at the bench controls and select to reverse the lower arm’s pulse order or run another batch. Physical headset validation is still needed.

The optical bench imports into other engines as a glTF 2.0 binary. Rebuild the asset with Blender (verified with 4.3.2):

```sh
blender --background --python scripts/build-interferometer.py
```

The spin and Fourier calculations are independent of Three.js. The files under `tests/` provide numerical reference cases for a future native Unreal implementation.

## Project layout

- `src/labs/spin/` — SU(2) rotations, neutron counts, Three.js rendering and XR interactions.
- `src/labs/field/` — Fourier states, mode and site plots, and quadrature sampling.
- `src/labs/LabPages.tsx` — dedicated lab routes and on-demand chapter embeds.
- `public/models/interferometer.glb` — the reusable optical bench.
- `src/articles/` — the original MDX notebook with the two lab entry points.
