const path = require('node:path')
const { spawn } = require('node:child_process')
const { prepareRuntime, runtimeEnvironment } = require('./runtime.cjs')
const serviceDir = path.resolve(__dirname, '..')
const runtimeDir = prepareRuntime(serviceDir, process.env.STKTYASTRA_NODE_RED_RUNTIME_DIR)
const entry = require.resolve('node-red/red.js')
const child = spawn(process.execPath, [entry, '--userDir', runtimeDir, '--settings', path.join(serviceDir, 'settings.cjs')], {
  cwd: runtimeDir,
  stdio: 'inherit',
  env: runtimeEnvironment(runtimeDir),
})
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal))
child.on('error', (error) => { console.error(error.message); process.exitCode = 1 })
child.on('exit', (code) => { process.exitCode = code ?? 0 })
