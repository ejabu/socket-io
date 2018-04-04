var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

io.on('connect', function(socket){ //'connect' or 'connection' both are okay
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  // socket.emit('chat message', "Welcome"); //BUAT SINGLE SOCKET yang baru tersambung
  // io.emit('chat message', "Welcome"); //BUAT SEMUA
  
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  
  socket.on('clientIntro', function(msg){
    console.log('clientIntro: ' + msg);
    socket.emit('auth', 'Send secret_key !', function (answer) {
      if (answer.secret_key=='BINARY_ACK') {
        var message = answer.store_name + " is connected. Active Users are : " + io.engine.clientsCount
        console.log(message);
        io.emit('chat message', message);
      }
      else {
        socket.disconnect()
      }
    });
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});