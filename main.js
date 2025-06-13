const { app, BrowserWindow, ipcMain, dialog, Notification } = require('electron')
const path = require('node:path')
const fs = require('node:fs')
const remote = require('@electron/remote/main')

remote.initialize()

const uploadDir = path.join(__dirname, 'uploads')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // sandbox: true,
      // nodeIntegration: true, // 允许渲染进程使用 node
      preload: path.join(__dirname, 'preload.js')
    }
  })

  remote.enable(win.webContents)
  win.loadFile('index.html')
  win.webContents.openDevTools()
  return win
}

// function createSecondWindow(parent) {
//   const win = new BrowserWindow({
//     width: 600,
//     height: 300,
//     parent,
//   })
//   win.loadFile('second.html')
//   return win
// }
function updateCounter(win) {
  let count = 0
  let timer
  win.webContents.send('update-counter', count)
  timer = setInterval(() => {
    count++
    if  (count > 10) {
      clearInterval(timer)
    }
    win.webContents.send('update-counter', count)
  }, 1000)
}

app.on('ready', () => {
  ipcMain.on('set-title', (event, title) => {
    console.log(event, title)
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })
  ipcMain.handle('write-file', (event, content) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir)
    }

    const filePath = path.join(uploadDir, 'test.txt')
    fs.writeFileSync(filePath, content)
    const stats = fs.statSync(filePath)
    console.log(stats)
    return stats.size
  })
  ipcMain.handle('open-dialog', async (event, options) => {

    const files = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections']
    })
    console.log('selected files', files)
    new Notification({
      title: '选择的第一个文件路径',
      body: files.filePaths[0],
    }).show()
    return files.filePaths
  })
  const win = createWindow()
  updateCounter(win)
})
