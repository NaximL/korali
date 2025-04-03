const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(express.json());

app.get("/", (req, res) => {
    res.redirect("/home");
});

// Путь для статичных файлов
app.use('/home', express.static(path.join(__dirname, 'web/html')));

// Общий обработчик запросов для других файлов
app.use((req, res) => {
    const pathname = decodeURIComponent(url.parse(req.url).pathname);
    const filePath = path.join(__dirname, pathname);

    // Ограничиваем доступ к директориям за пределами нашего каталога
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