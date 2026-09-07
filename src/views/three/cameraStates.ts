type Vector = [number, number, number]
interface CameraState {
  position: Vector
  target: Vector
  referenceAspect: number
}
// Visual coordinates only; future GLB assets can retain these named presets.
export const cameraStates = {
  home: { position: [10, 6.5, 17], target: [0, 0.5, 0], referenceAspect: 1.6 },
  membranes: { position: [7.2, 3.5, 8.2], target: [2.35, 0.3, 0], referenceAspect: 1.3 },
} satisfies Record<string, CameraState>
