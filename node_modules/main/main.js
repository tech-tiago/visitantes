const { app, BrowserWindow } = require('electron');
const path = require('path');
const waitPort = require('wait-port');
const server = require('../app'); // Importa seu servidor Express

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 768,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#485FC7',
            symbolColor: '#fff'
          },
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadURL('http://localhost:3000'); // Carrega seu servidor Express

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

}

async function startApp() {
    try {
        const portOpen = await waitPort({ host: 'localhost', port: 3000, timeout: 10000 }); // Aguarda até 10 segundos para o servidor estar pronto
        if (portOpen) {
            createWindow();
        } else {
            console.error('Port 3000 did not open in time');
            app.quit();
        }
    } catch (error) {
        console.error('Error while waiting for port 3000:', error);
        app.quit();
    }
}

app.on('ready', startApp);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        startApp();
    }
});
