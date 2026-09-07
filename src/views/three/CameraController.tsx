import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cameraStates } from './cameraStates'

export function CameraController({ state }: { state: keyof typeof cameraStates }) {
  const { camera, size, invalidate } = useThree()
  const reducedMotion = useReducedMotion()
  const lookAt = useMemo(() => new Vector3(...cameraStates.home.target), [])
  const destination = useMemo(() => {
    const preset = cameraStates[state]
    const target = new Vector3(...preset.target)
    const aspect = size.width / Math.max(1, size.height)
    const fit = Math.max(1, preset.referenceAspect / aspect)
    return { target, position: new Vector3(...preset.position).sub(target).multiplyScalar(fit).add(target) }
  }, [state, size.width, size.height])
  useEffect(() => { invalidate() }, [destination, reducedMotion, invalidate])
  useFrame((_, delta) => {
    const alpha = reducedMotion ? 1 : 1 - Math.exp(-5 * Math.min(delta, 0.1))
    camera.position.lerp(destination.position, alpha)
    lookAt.lerp(destination.target, alpha)
    camera.lookAt(lookAt)
    if (camera.position.distanceToSquared(destination.position) > 0.00001 || lookAt.distanceToSquared(destination.target) > 0.00001) invalidate()
  })
  return null
}
