import { Canvas } from '@react-three/fiber'
import { Component, type PropsWithChildren } from 'react'
import { useMachine } from '../state/MachineContext'
import { CameraController } from './three/CameraController'
import { cameraStates } from './three/cameraStates'
import { ContainerFrame, Pretreatment, HighPressurePump, Membranes, Piping, ElectricalCabinet } from './three/MachineParts'

function UnavailableView() {
  const { setViewMode } = useMachine()
  return <div className="viewport-message" role="status">
    <p>La vue 3D n’est pas disponible sur cet appareil.</p>
    <button type="button" onClick={() => setViewMode('image')}>Revenir à la vue 2.5D</button>
  </div>
}
class SceneBoundary extends Component<PropsWithChildren, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <UnavailableView /> : this.props.children }
}
function MachineScene() {
  const { selectedEquipment, selectEquipment } = useMachine()
  return <>
    <color attach="background" args={['#10161c']} />
    <ambientLight intensity={1.3} />
    <directionalLight position={[3, 7, 6]} intensity={2.6} />
    <directionalLight position={[-5, 2, 2]} intensity={1} />
    <CameraController state={selectedEquipment === 'membranes' ? 'membranes' : 'home'} />
    <group onClick={() => selectEquipment(null)}>
      <ContainerFrame /><Pretreatment /><HighPressurePump />
      <Piping /><ElectricalCabinet /><Membranes />
    </group>
  </>
}
export function ThreeMachineView() {
  const { selectEquipment } = useMachine()
  return <div className="three-machine" aria-label="Représentation 3D de l’unité d’osmose">
    <SceneBoundary>
      <Canvas camera={{ position: cameraStates.home.position, fov: 40 }} dpr={[1, 1.5]} frameloop="demand"
        fallback={<UnavailableView />} onPointerMissed={() => selectEquipment(null)}>
        <MachineScene />
      </Canvas>
    </SceneBoundary>
  </div>
}
