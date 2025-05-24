const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('customVar', {
  node: process.versions.node,
  chrome: process.versions.chrome,
  electron: process.versions.electron,
  // we can also expose variables, not just functions
  // api: api,
  // exposedProp: 'some-value'
  // ...
  // ...
})

contextBridge.exposeInMainWorld('electron', {
  setTitle: title => {
    ipcRenderer.send('set-title', title)
  },
  writeFile: (content) => {
    return ipcRenderer.invoke('write-file', content)
  },
  onUpdateCounter: callback => ipcRenderer.on('update-counter', callback),
})
