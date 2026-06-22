var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('static/index.html');
});

app.use(express.static('static'));


http.listen(3002, function(){
  console.log('listening on *:3002');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('roll', function (data) {
    if (!data.nick) data.nick = "unnamed";
    try {
        data.number = parseInt(data.number);
    } catch(err) {
        data.number = 1;
    }
    try {
        data.sides = parseInt(data.sides);
    } catch(err) {
        data.sides = 6;
    }
    var rolls = [];
    for (var x=0; x<data.number; x++) {
        rolls.push(Math.ceil( Math.random() * data.sides));
    }

    var sum = rolls.reduce(function (a,b) {
        return a+b;
    });

    io.emit("event", {"type": "roll", "rolls": rolls, "sum": sum, "nick": data.nick, "sides": data.sides, "number": data.number });
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
