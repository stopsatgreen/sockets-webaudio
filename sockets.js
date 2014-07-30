var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.sockets.on('connection', function(socket){

  socket.broadcast.emit('user-connect', socket.id);

  socket.on('btn-push', function(msg) {
    socket.broadcast.emit('btn-pushed');
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
