const http = require("http");
const { Server } = require("socket.io");
const express = require('express');

const app = express();
const HTTPServer = http.createServer(app);
const ws = new Server(HTTPServer);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

ws.on('connection', (socket) => {
    console.log('a user has connected');
    socket.on('disconnect', () => {
        console.log('a user has disconnected');
    });

    socket.on('Msg to Server', (msg) => {
        console.log('message: ' + msg);
        ws.emit('Msg to Client', msg);

    });
});

HTTPServer.listen(3000, () => {
    console.log('listening on *:3000');
});

