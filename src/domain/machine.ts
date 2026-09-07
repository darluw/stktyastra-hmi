export type MachineStatus = 'running' | 'stopped' | 'warning' | 'alarm'
export type EquipmentId = 'membranes'
export type ViewMode = 'image' | 'three'

export interface MachineSnapshot {
  id: string
  label: string
  status: MachineStatus
  source: 'mock'
}

export const machineStatusLabels: Record<MachineStatus, string> = {
  running: 'En fonctionnement',
  stopped: 'À l’arrêt',
  warning: 'Attention',
  alarm: 'Alarme',
}
