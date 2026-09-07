import { useEffect } from 'react'
import { EquipmentPanel } from './components/EquipmentPanel'
import { Header } from './components/Header'
import { MachineViewport } from './components/MachineViewport'
import { ViewModeToggle } from './components/ViewModeToggle'
import { MachineProvider, useMachine } from './state/MachineContext'

function MachinePage() {
  const { selectedEquipment, selectEquipment } = useMachine()
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') selectEquipment(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectEquipment])
  return <main className="app-shell">
    <Header />
    <div className={`workspace ${selectedEquipment ? 'workspace--selected' : ''}`}>
      <div className="viewport-heading">
        <span>{selectedEquipment ? 'FOCUS / MEMBRANES' : 'VUE GÉNÉRALE'}</span>
        <span className="viewport-caption">UNITÉ GÉNÉRIQUE · RO-01</span>
      </div>
      <MachineViewport />
      <EquipmentPanel />
      <div className="viewport-toolbar">
        <div className="equipment-navigation" role="group" aria-label="Sélection d’équipement">
          <button type="button" aria-pressed={selectedEquipment === 'membranes'} aria-controls="equipment-panel"
            onClick={() => selectEquipment('membranes')}>Membranes</button>
          {selectedEquipment && <button type="button" onClick={() => selectEquipment(null)}>Vue globale</button>}
        </div>
        <ViewModeToggle />
      </div>
    </div>
    <footer className="app-footer">
      <span>V1 / DÉMONSTRATION · DONNÉES SIMULÉES</span>
      <span>SUPERVISION LOCALE</span>
    </footer>
  </main>
}
export default function App() {
  return <MachineProvider><MachinePage /></MachineProvider>
}
