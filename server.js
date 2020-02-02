var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var initiator = false;
var str = null;
io.on('connection', (socket) => {
    console.log('user connected');
    
socket.on('initiate', () => {
    initiator = true;
    io.emit('initiate');
    io.emit('consult_initiate',{initiator:initiator});
});
socket.on('consult_initiate', () => {
    io.emit('consult_initiate',{initiator:initiator});
});
socket.on('traer_token', () => {
    io.emit('mostrar_token',str);
});
socket.on('offer', (data) => {
    str = data;
    socket.broadcast.emit('offer', data);
});
});
app.use(express.static('public'));

http.listen(3000, () => console.log('Example app listening on port 3000!'))