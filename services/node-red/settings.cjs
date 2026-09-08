const fs = require('node:fs')
const path = require('node:path')
const runtimeDir = process.env.STKTYASTRA_NODE_RED_RUNTIME_DIR || path.join(__dirname, '.runtime')
const port = Number(process.env.STKTYASTRA_NODE_RED_PORT || 1881)
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  throw new Error('STKTYASTRA_NODE_RED_PORT doit être un entier entre 1024 et 65535.')
}
module.exports = {
  uiHost: '127.0.0.1',
  uiPort: port,
  userDir: runtimeDir,
  flowFile: 'flows.json',
  flowFilePretty: true,
  credentialSecret: fs.readFileSync(path.join(runtimeDir, 'credential-secret'), 'utf8').trim(),
  contextStorage: { default: { module: 'memory' } },
  externalModules: {
    autoInstall: false,
    palette: { allowInstall: false, allowUpload: false },
    modules: { allowInstall: false },
  },
  functionExternalModules: false,
  editorTheme: {
    projects: { enabled: false },
    page: { title: 'STKTYASTRA — Node-RED' },
    header: { title: 'STKTYASTRA — Collecte OPC UA' },
  },
  logging: { console: { level: 'info', metrics: false, audit: false } },
}
