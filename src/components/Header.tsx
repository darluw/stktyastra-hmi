import { machineStatusLabels } from '../domain/machine'
import { useMachine } from '../state/MachineContext'

export function Header() {
  const { machine } = useMachine()

  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">STKTYASTRA / SUPERVISION</p>
        <h1>{machine.label}</h1>
      </div>

      <div role="status" aria-label={`État machine : ${machineStatusLabels[machine.status]}`} className={`machine-status machine-status--${machine.status}`}>
        <span className="machine-status__dot" aria-hidden="true" />
        <span>{machineStatusLabels[machine.status]}</span>
      </div>
    </header>
  )
}
