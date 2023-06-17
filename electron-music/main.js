const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

let win

function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        show: false
    })

    win.maximize();
    win.show();
    win.setMenu(null)

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'frontend', 'angular-music', 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.setIcon(url.format({
        pathname: path.join(__dirname, 'frontend', 'angular-music', 'assets', 'favicon.ico'),
        protocol: 'file:',
        slashes: true
    }))

    win.on('closed', () => {
        win = null
    })
}
app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})