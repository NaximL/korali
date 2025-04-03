const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { app, BrowserWindow } = require('electron');

const PORT = process.env.PORT || 3000;
const appServer = express();
const server = http.createServer(appServer);

appServer.use(express.json());

appServer.use('/home', express.static(path.join(__dirname, 'web/html')));

appServer.use((req, res) => {
    const pathname = decodeURIComponent(url.parse(req.url).pathname);
    const filePath = path.join(__dirname, pathname);

    if (!filePath.startsWith(__dirname)) {
        return res.status(403).send("Доступ заборонено!");
    }

    fs.stat(filePath, (err, stats) => {
        if (err || stats.isDirectory()) {
            return res.status(404).send("Сторінка не знайдена!");
        }
        res.sendFile(filePath);
    });
});

server.listen(PORT, () => {
    console.log("Сервер запущено на порту", PORT);
});

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false
        }
    });

    mainWindow.loadURL(`http://localhost:${PORT}/home`);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});