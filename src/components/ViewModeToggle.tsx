import { useMachine } from '../state/MachineContext'
import type { ViewMode } from '../domain/machine'

const modes: Array<{ id: ViewMode; label: string }> = [
  { id: 'image', label: '2.5D' },
  { id: 'three', label: '3D' },
]

export function ViewModeToggle() {
  const { viewMode, setViewMode } = useMachine()

  return (
    <div className="view-toggle" role="group" aria-label="Mode de représentation">
      {modes.map((mode) => (
        <button
          type="button"
          key={mode.id}
          className={viewMode === mode.id ? 'is-active' : ''}
          aria-pressed={viewMode === mode.id}
          onClick={() => setViewMode(mode.id)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}
