const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const net = require('node:net')
const http = require('node:http')
const { spawn } = require('node:child_process')
const { once } = require('node:events')
const { prepareRuntime, runtimeEnvironment } = require('./runtime.cjs')
const serviceDir = path.resolve(__dirname, '..')
const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'stktyastra-startup-'))
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const get = (port, endpoint) => new Promise((resolve, reject) => {
  const request = http.get({ hostname: '127.0.0.1', port, path: endpoint, headers: { Accept: 'application/json' } }, response => {
    let body = ''
    response.on('data', chunk => { body += chunk })
    response.on('end', () => resolve({ status: response.statusCode, body }))
  })
  request.setTimeout(2000, () => request.destroy(new Error('HTTP timeout')))
  request.on('error', reject)
})
let child
let logs = ''
async function main() {
  prepareRuntime(serviceDir, runtimeDir)
  const probe = net.createServer()
  probe.listen(0, '127.0.0.1')
  await once(probe, 'listening')
  const port = probe.address().port
  await new Promise(resolve => probe.close(resolve))
  child = spawn(process.execPath, [require.resolve('node-red/red.js'), '--userDir', runtimeDir, '--settings', path.join(serviceDir, 'settings.cjs')], {
    cwd: runtimeDir,
    env: { ...runtimeEnvironment(runtimeDir), STKTYASTRA_NODE_RED_RUNTIME_DIR: runtimeDir, STKTYASTRA_NODE_RED_PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stdout.on('data', data => { logs += data })
  child.stderr.on('data', data => { logs += data })
  const deadline = Date.now() + 30000
  let response
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error('Node-RED exited before readiness')
    try { response = await get(port, '/flows'); if (response.status === 200) break } catch {}
    await delay(200)
  }
  assert.equal(response?.status, 200, 'Flow API ready')
  assert.equal((await get(port, '/')).status, 200, 'Editor served')
  const modules = JSON.parse((await get(port, '/nodes')).body)
  const types = modules.flatMap(m => m.types ?? (m.nodes ?? []).flatMap(n => n.types ?? []))
  assert.ok(types.includes('OpcUa-Client'), 'OPC UA client registered')
  assert.ok(types.includes('OpcUa-Endpoint'), 'OPC UA endpoint registered')
  assert.ok(!logs.includes('already registered'), 'No duplicate nodes')
  assert.ok(!JSON.parse(response.body).some(n => n.type === 'OpcUa-Client'), 'No automatic Ewon connection')
  console.log('PASS: dedicated runtime, editor HTTP 200, OPC UA palette, no automatic Ewon connection')
}
main().catch(error => { console.error(error.message, logs.slice(-6000)); process.exitCode = 1 }).finally(async () => {
  if (child && child.exitCode === null) {
    const closed = once(child, 'exit')
    child.kill('SIGTERM')
    const timer = setTimeout(() => child.kill('SIGKILL'), 5000)
    await closed
    clearTimeout(timer)
  }
  fs.rmSync(runtimeDir, { recursive: true, force: true })
})
