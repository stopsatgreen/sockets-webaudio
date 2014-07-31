var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.sockets.on('connection', function(socket){

  socket.broadcast.emit('user-connect', socket.id);

  socket.on('audio-update', function (volume) {
    socket.broadcast.emit('audio-new-value', volume);
  });

  socket.on('stopped', function() {
    socket.broadcast.emit('btn-active');
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
