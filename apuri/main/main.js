const { app, BrowserWindow, globalShortcut } = require('electron')

const { NODE_ENV } = process.env

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

const createWindow = () => {
  win = new BrowserWindow({
    show: false,
    width: 300,
    height: 350,
    backgroundColor: '#000',
    autoHideMenuBar: true,
    // cors'ish
    webPreferences: {
      webSecurity: false
    }
  })

  win.loadURL('http://localhost:8000')

  win.once('ready-to-show', () => {
    win.show()
  })

  const { webContents } = win

  if (NODE_ENV === 'development') {
    // Open the DevTools.
    webContents.openDevTools()
  }

  webContents.on('did-finish-load', () => {
    webContents.setZoomFactor(1)
    webContents.setLayoutZoomLevelLimits(0, 0)
  })

  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  // Remove the menu bar
  win.setMenu(null)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
