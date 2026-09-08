const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')

function prepareRuntime(serviceDir, runtimeDir = path.join(serviceDir, '.runtime')) {
  fs.mkdirSync(runtimeDir, { recursive: true, mode: 0o700 })
  // Exclusive creation: restarting or pulling source never overwrites local flows or keys.
  const seed = fs.readFileSync(path.join(serviceDir, 'flows', 'initial.json'))
  const createOnce = (name, content) => {
    try { fs.writeFileSync(path.join(runtimeDir, name), content, { flag: 'wx', mode: 0o600 }) }
    catch (error) { if (error.code !== 'EEXIST') throw error }
  }
  createOnce('flows.json', seed)
  createOnce('credential-secret', crypto.randomBytes(32).toString('hex'))
  return runtimeDir
}
function runtimeEnvironment(runtimeDir, inherited = process.env) {
  // The OPC UA palette uses env-paths, independently of Node-RED's userDir.
  // Set child-process app-data paths only; leave the user's HOME and system settings untouched.
  return {
    ...inherited,
    APPDATA: path.join(runtimeDir, 'config'),
    LOCALAPPDATA: path.join(runtimeDir, 'data'),
    XDG_CONFIG_HOME: path.join(runtimeDir, 'config'),
    XDG_DATA_HOME: path.join(runtimeDir, 'data'),
    XDG_CACHE_HOME: path.join(runtimeDir, 'cache'),
  }
}
module.exports = { prepareRuntime, runtimeEnvironment }
