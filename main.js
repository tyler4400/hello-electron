const { app, BrowserWindow } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })
  win.loadFile('index.html')
  win.webContents.openDevTools()
  return win
}

function createSecondWindow(index) {
  const win = new BrowserWindow({
    width: 600,
    height: 300,
    parent: index,
  })
  win.loadFile('second.html')
  return win
}

app.on('ready', () => {
  const index = createWindow()
  createSecondWindow(index)
})
