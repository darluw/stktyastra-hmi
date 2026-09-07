import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { JSDOM } from 'jsdom'
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MachineProvider, useMachine } from '../src/state/MachineContext.tsx'
import { Header } from '../src/components/Header.tsx'
import { EquipmentPanel } from '../src/components/EquipmentPanel.tsx'
import { ViewModeToggle } from '../src/components/ViewModeToggle.tsx'
import { mockMachineSource } from '../src/data/machineSource.ts'
import { cameraStates } from '../src/views/three/cameraStates.ts'
import { PerspectiveCamera, Vector3 } from 'three'

const dom = new JSDOM('<!doctype html><div id="root"></div>')
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.IS_REACT_ACT_ENVIRONMENT = true
let root
const el = React.createElement
const mount = async (content) => {
  root = createRoot(document.getElementById('root'))
  await act(async () => root.render(content))
}
const click = async (label) => {
  const button = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === label)
  assert.ok(button, `Button ${label} exists`)
  await act(async () => button.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })))
}
afterEach(async () => { if (root) { await act(async () => root.unmount()); root = undefined } })

function Renderer({ name }) {
  const { selectedEquipment, selectEquipment } = useMachine()
  return el('div', { 'data-renderer': name },
    el('output', null, selectedEquipment ?? 'global'),
    el('button', { onClick: () => selectEquipment('membranes') }, 'Sélectionner'))
}
function SharedPage() {
  const { viewMode } = useMachine()
  return el(React.Fragment, null,
    el(Renderer, { key: viewMode, name: viewMode }), el(ViewModeToggle), el(EquipmentPanel))
}

test('selection survives renderer unmounts in both directions', async () => {
  await mount(el(MachineProvider, null, el(SharedPage)))
  await click('Sélectionner')
  await click('3D')
  assert.equal(document.querySelector('[data-renderer]').dataset.renderer, 'three')
  assert.equal(document.querySelector('output').textContent, 'membranes')
  assert.equal(document.querySelector('#equipment-panel strong').textContent, 'Normal')
  await click('2.5D')
  assert.equal(document.querySelector('output').textContent, 'membranes')
  assert.equal(document.querySelector('[data-renderer]').dataset.renderer, 'image')
})

test('return to global clears selection and panel in either renderer', async () => {
  await mount(el(MachineProvider, null, el(SharedPage)))
  for (const mode of ['3D', '2.5D']) {
    await click(mode)
    await click('Sélectionner')
    await click('Retour à la vue globale')
    assert.equal(document.querySelector('output').textContent, 'global')
    assert.equal(document.querySelector('#equipment-panel'), null)
  }
})

for (const [status, label] of Object.entries({ running: 'En fonctionnement', stopped: 'À l’arrêt', warning: 'Attention', alarm: 'Alarme' })) {
  test(`header displays supplied ${status} snapshot in French`, async () => {
    const source = { getSnapshot: () => ({ id: 'RO-01', label: 'RO-01', status, source: 'mock' }) }
    await mount(el(MachineProvider, { source }, el(Header)))
    assert.equal(document.querySelector('[role="status"]').textContent, label)
  })
}

test('mock snapshots are isolated between consumers', () => {
  const snapshot = mockMachineSource.getSnapshot()
  snapshot.status = 'alarm'
  assert.equal(mockMachineSource.getSnapshot().status, 'running')
})

test('controlled camera frames machine and membranes at desktop and tablet aspect ratios', () => {
  for (const aspect of [1, 1.6, 2.2, 0.75]) {
    for (const [name, preset] of Object.entries(cameraStates)) {
      const target = new Vector3(...preset.target)
      const fit = Math.max(1, preset.referenceAspect / aspect)
      const camera = new PerspectiveCamera(40, aspect, 0.1, 1000)
      camera.position.copy(new Vector3(...preset.position).sub(target).multiplyScalar(fit).add(target))
      camera.lookAt(target)
      camera.updateMatrixWorld()
      const bounds = name === 'home' ? [[-6.5, 6.5], [-1.6, 3.1], [-1.8, 1.8]] : [[0, 4.7], [-1.1, 1.8], [-0.4, 0.4]]
      for (const x of bounds[0]) for (const y of bounds[1]) for (const z of bounds[2]) {
        const point = new Vector3(x, y, z).project(camera)
        assert.ok(Math.abs(point.x) < 1 && Math.abs(point.y) < 1, `${name} clipped at aspect ${aspect}: ${point.toArray()}`)
      }
    }
  }
})
