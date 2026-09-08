const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { prepareRuntime } = require('./runtime.cjs')

test('first start seeds a private runtime; subsequent starts preserve flows and credentials', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stktyastra-'))
  try {
    fs.mkdirSync(path.join(dir, 'flows'))
    fs.writeFileSync(path.join(dir, 'flows', 'initial.json'), '[]')
    const runtime = prepareRuntime(dir)
    const secret = fs.readFileSync(path.join(runtime, 'credential-secret'), 'utf8')
    assert.match(secret, /^[a-f0-9]{64}$/)
    fs.writeFileSync(path.join(runtime, 'flows.json'), '[{"id":"local-edit"}]')
    fs.writeFileSync(path.join(runtime, 'flows_cred.json'), '{"$":"encrypted-credentials"}')
    fs.writeFileSync(path.join(dir, 'flows', 'initial.json'), '[{"id":"new-seed"}]')
    prepareRuntime(dir)
    assert.equal(fs.readFileSync(path.join(runtime, 'flows.json'), 'utf8'), '[{"id":"local-edit"}]')
    assert.equal(fs.readFileSync(path.join(runtime, 'credential-secret'), 'utf8'), secret)
    assert.equal(fs.readFileSync(path.join(runtime, 'flows_cred.json'), 'utf8'), '{"$":"encrypted-credentials"}')
  } finally { fs.rmSync(dir, { recursive: true, force: true }) }
})

test('OPC UA application-data paths stay private without changing parent environment', () => {
  const { runtimeEnvironment } = require('./runtime.cjs')
  const inherited = { HOME: '/existing-home', APPDATA: '/radar', SOME_SETTING: 'keep' }
  const env = runtimeEnvironment('/project/.runtime', inherited)
  assert.equal(env.HOME, inherited.HOME)
  assert.equal(env.SOME_SETTING, 'keep')
  assert.equal(inherited.APPDATA, '/radar')
  for (const key of ['APPDATA', 'LOCALAPPDATA', 'XDG_CONFIG_HOME', 'XDG_DATA_HOME', 'XDG_CACHE_HOME']) {
    assert.ok(env[key].startsWith(path.join('/project', '.runtime')))
  }
})

test('diagnostic is opt-in, has no secrets and uses only manual read/browse/disconnect operations', () => {
  const flow = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'flows', 'opcua-diagnostic.json')))
  assert.equal(flow.find(n => n.type === 'tab').disabled, true)
  for (const node of flow) {
    assert.equal(node.credentials, undefined)
    if (node.type === 'inject') {
      assert.equal(node.once, false)
      assert.equal(node.repeat, '')
      assert.ok(['read', 'browse', 'disconnect'].includes(node.props.find(p => p.p === 'action').v))
    }
    if (node.type === 'OpcUa-Client') assert.equal(node.action, 'read')
  }
})
