import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react'
import { mockMachineSource, type MachineSource } from '../data/machineSource'
import type { EquipmentId, MachineSnapshot, ViewMode } from '../domain/machine'

interface MachineUiState {
  machine: MachineSnapshot
  selectedEquipment: EquipmentId | null
  viewMode: ViewMode
  selectEquipment: (equipment: EquipmentId | null) => void
  setViewMode: (mode: ViewMode) => void
}

const MachineContext = createContext<MachineUiState | null>(null)

export function MachineProvider({ children, source = mockMachineSource }: PropsWithChildren<{ source?: MachineSource }>) {
  const [machine] = useState(() => source.getSnapshot())
  const [selectedEquipment, selectEquipment] = useState<EquipmentId | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('image')

  const value = useMemo(
    () => ({
      machine,
      selectedEquipment,
      viewMode,
      selectEquipment,
      setViewMode,
    }),
    [machine, selectedEquipment, viewMode],
  )

  return <MachineContext.Provider value={value}>{children}</MachineContext.Provider>
}

export function useMachine() {
  const context = useContext(MachineContext)
  if (!context) {
    throw new Error('useMachine must be used inside MachineProvider')
  }
  return context
}
