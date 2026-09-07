import { useMachine } from '../state/MachineContext'

export function EquipmentPanel() {
  const { selectedEquipment, selectEquipment } = useMachine()

  if (selectedEquipment !== 'membranes') {
    return null
  }

  return (
    <aside id="equipment-panel" className="equipment-panel" aria-labelledby="equipment-title">
      <div>
        <p className="eyebrow">ÉQUIPEMENT SÉLECTIONNÉ</p>
        <h2 id="equipment-title">Membranes</h2>
      </div>

      <div className="equipment-panel__status">
        <span className="equipment-panel__status-dot" aria-hidden="true" />
        <div>
          <span className="equipment-panel__label">État</span>
          <strong>Normal</strong>
        </div>
      </div>

      <button type="button" className="panel-close" onClick={() => selectEquipment(null)}>
        Retour à la vue globale
      </button>
    </aside>
  )
}
