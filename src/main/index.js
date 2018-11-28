'use strict'

import {app, BrowserWindow, Menu} from 'electron'
import windowRepository from './windowRepository'

const path = require('path')

// const windowSettings = windowRepository(path.join(app.getPath('userData'), 'window.json'))
const windowSettings = windowRepository('resources/window.json')
// global.userDataPath = path.join(app.getPath('userData'), 'backlog.json')
global.userDataPath = path.join('resources/settings.json')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://127.0.0.1:9080`
  : `file://${__dirname}/index.html`
// const winURL = `http://127.0.0.1:9080`
function createWindow () {
  const windowConfig = windowSettings.getWindowState()
  // const windowConfig
  windowConfig.frame = false
  windowConfig.resizable = true
  windowConfig.icon = path.join(__dirname, '/assets/worker.png')
  windowConfig.center = true
  windowConfig.webPreferences = {webSecurity: false, defaultFontSize: 12} // 禁用同源策略
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow(windowConfig)

  mainWindow.loadURL(winURL)
  //mainWindow.webContents.openDevTools()

  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(createMenuOnMac())
  } else {
    mainWindow.setMenu(null)
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  //mainWindow.on('resize', () => saveWindowState(mainWindow))
  //mainWindow.on('move', () => saveWindowState(mainWindow))
  //mainWindow.on('close', () => saveWindowState(mainWindow))
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

require('electron-context-menu')()

function saveWindowState (mainWindow) {
  windowSettings.updateWindowState(mainWindow.getBounds())
}

function createMenuOnMac () {
  return Menu.buildFromTemplate([
    {
      label: app.getName(),
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'},
        {role: 'quit'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'}
      ]
    }
  ])
}
