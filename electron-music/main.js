const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs');

let win

function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        show: false,
        icon: path.join(__dirname, 'frontend', 'angular-music', 'assets', 'favicon.ico')
    })

    win.maximize();
    win.show();
    win.setMenu(null)

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'frontend', 'angular-music', 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.on('closed', () => {
        win = null
    })

    if (!fs.existsSync(path.join(__dirname, 'uploads', 'playlists'))) {
        fs.mkdirSync(path.join(__dirname, 'uploads', 'playlists'), { recursive: true });
    }

    if (!fs.existsSync(path.join(__dirname, 'cache'))) {
        fs.mkdirSync(path.join(__dirname, 'cache'));
    }
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