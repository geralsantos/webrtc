var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('user connected');
    
socket.on('initiate', () => {
    io.emit('initiate');
});
socket.on('offer', (data) => {
    socket.broadcast.emit('offer', data);
});
});
app.use(express.static('public'));

http.listen(3000, () => console.log('Example app listening on port 3000!'))