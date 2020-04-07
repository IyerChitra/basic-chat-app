var express = require('express');
var app = express();
var http = require('http').createServer(app);
var port = 5000;
var io = require('socket.io')(http);

app.get("/", function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('username', function(username) {
        socket.username = username;
        console.log(socket.username + ' connected');
        io.emit('is_online', '🔵 <i><strong>' + socket.username + '</strong> joined the chat..</i>');
    });

    socket.on('disconnect', function(){
        console.log('User Disconnected');
        io.emit('is_online', '🔴 <i><strong>' + socket.username + '</strong> left the chat..</i>');
    });
    
    socket.on('chat message', function(msg){
        console.log('Message: ' + msg);
        io.emit('chat message', '<strong>' + socket.username + '</strong>: ' + msg);
    });
    
    socket.on('typing', function(data){
        console.log(socket.username + ' is Typing');
        socket.broadcast.emit('typing', '<i> <strong>' + socket.username + '</strong> is typing...</i>');
    });
    
    socket.on('typingdone', function(data){
        socket.broadcast.emit('typingdone', '');
    });
    
});

http.listen(port, function(){
    console.log('Listening on Port: '+ port +'. Happy Listening!');
});
