const { app, BrowserWindow, ipcMain, Menu, screen } = require('electron');
const { watchJournalChanges } = require('./events/journal');
const { getMissionDetails } = require('./events/mission');
const { getConfig, createConfig } = require('./data/config');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow = null;
let splashWindow = null;

function createSplashScreen() {
    splashWindow = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false, // hide title bar
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
        },
    });

    if(app.isPackaged) {
        splashWindow.loadFile(`${path.join(__dirname, '../dist/index.html')}`)
    } else {
        splashWindow.loadURL('http://localhost:5173');
    }
    
}

function createWindow() {
    Menu.setApplicationMenu(null);

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const iconPath = process.platform === 'win32' 
    ? path.join(__dirname, 'icon.ico')
    : path.join(__dirname, 'icon.png');

    mainWindow = new BrowserWindow({
        width,
        height,
        icon: iconPath,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    
    if(app.isPackaged) {
        const indexedPath = `${path.join(__dirname, '../dist/index.html')}`;
        mainWindow.loadFile(indexedPath).then(() => {
            mainWindow.webContents.executeJavaScript(`window.location.hash = '#/main';`);
        });
    } else {
        mainWindow.webContents.openDevTools();
        mainWindow.loadURL('http://localhost:5173/#/main');
    }

    mainWindow.on('ready-to-show', () => {
        watchJournalChanges(mainWindow);  
    });
    

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createSplashScreen();

    setTimeout(() => {
        splashWindow.close();
        createWindow();
        
    }, 3000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// REGISTER ELECTRON FUNCTIONS
ipcMain.handle('get-mission-details', async () => {
    return getMissionDetails();
});

ipcMain.handle('get-mission-config', async () => {
    return getConfig();
});

ipcMain.handle('set-mission-config', async (event, data) => {
    return createConfig(data);
});
