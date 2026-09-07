import type { MachineSnapshot } from '../domain/machine'
import { mockMachine } from './mockMachine'

// Minimal read boundary. A future API adapter can provide the same snapshot.
export interface MachineSource {
  getSnapshot: () => MachineSnapshot
}
export const mockMachineSource: MachineSource = {
  getSnapshot: () => ({ ...mockMachine }),
}
