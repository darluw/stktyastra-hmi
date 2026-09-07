import { useId } from 'react'
import machineImage from '../assets/machine-ro-v1.png'
import { useMachine } from '../state/MachineContext'

// Asset-space coordinates: image and hit regions always use the same transform.
const membraneOutlines = [
  '845,257 1289,299 1290,363 861,321',
  '870,339 1284,380 1286,439 871,396',
  '867,414 1281,455 1282,513 865,471',
  '857,488 1275,531 1276,588 858,544',
]

export function ImageMachineView() {
  const { selectedEquipment, selectEquipment } = useMachine()
  const selected = selectedEquipment === 'membranes'
  const maskId = useId()
  return (
    <div className={`image-machine ${selected ? 'has-selection' : ''}`} onClick={() => selectEquipment(null)}>
      <svg viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet" aria-label="Unité d’osmose inverse en container ouvert">
        <defs><clipPath id={maskId}>
          {membraneOutlines.map((points) => <polygon key={points} points={points} />)}
        </clipPath></defs>
        <image className="machine-image" href={machineImage} width="1672" height="941" />
        {selected && <image href={machineImage} width="1672" height="941" clipPath={`url(#${maskId})`} />}
        <g
          className={`membrane-hotspot ${selected ? 'is-selected' : ''}`}
          role="button" tabIndex={0} aria-label="Sélectionner les membranes"
          aria-pressed={selected} aria-controls="equipment-panel"
          onClick={(event) => { event.stopPropagation(); selectEquipment('membranes') }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              selectEquipment('membranes')
            }
          }}
        >
          {membraneOutlines.map((points) => <polygon key={points} points={points} vectorEffect="non-scaling-stroke" />)}
        </g>
      </svg>
    </div>
  )
}
