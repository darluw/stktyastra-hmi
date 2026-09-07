import { lazy, Suspense } from 'react'
import { useMachine } from '../state/MachineContext'
import { ImageMachineView } from '../views/ImageMachineView'

const ThreeMachineView = lazy(() => import('../views/ThreeMachineView').then((module) => ({ default: module.ThreeMachineView })))
export function MachineViewport() {
  const { viewMode } = useMachine()
  return <section className="machine-viewport" aria-label="Vue de la machine">
    {viewMode === 'image' ? <ImageMachineView /> : <Suspense fallback={<div className="viewport-message" role="status">Chargement de la vue 3D…</div>}><ThreeMachineView /></Suspense>}
  </section>
}
