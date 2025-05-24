const { contextBridge, ipcRenderer } = require('electron')

/**
 *不能直接访问fs
 * 从 Electron 20 开始，预加载脚本默认 沙盒化 ，不再拥有完整 Node.js 环境的访问权
 * https://www.electronjs.org/zh/docs/latest/tutorial/tutorial-preload#%E4%BD%BF%E7%94%A8%E9%A2%84%E5%8A%A0%E8%BD%BD%E8%84%9A%E6%9C%AC%E6%9D%A5%E5%A2%9E%E5%BC%BA%E6%B8%B2%E6%9F%93%E5%99%A8
  */
// const fs = require('fs')
// console.log(fs) // 报错  Cannot find module 'fs'

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
  openDialog: () => ipcRenderer.invoke('open-dialog')
})

// contextBridge.exposeInMainWorld('require', require)
