const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

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

app.on('ready', () => {
  ipcMain.on('set-title', (event, title) => {
    console.log(event, title)
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })
  createWindow()
})
