var express = require('express')
var bodyParser = require('body-parser')

var Group = require('./server/models/group');
var Channel = require('./server/models/channel');
var User = require('./server/models/user');

var app = express()
var http = require('http').Server(app)
var bodyPaser = bodyParser.json()
var port = process.env.PORT || 8080;
var io = require('socket.io')(http);

var Groups = [];
var Channels = [];
var Users = [];
var count = 0;
var Ucount = 1;

Users.push(new User(0,"Super","Super"));

app.use(express.static(__dirname + '/dist/Chat-Factory'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyPaser);
app.get('/', function(req,res){
    res.sendFile(express.static(__dirname + '/dist/Chat-Factory'));
});

app.post('/loginVerify', function (req, res) {
    var realUser = false;
    for(i=0;i<Users.length;i++){
        if(Users[i]._name = "Thomas"){
            realUser = true;
        }
    }
    if(!realUser){
     Users.push(new User(0,"Peasant","Peasant"));
    }
    return res.send({ statusCode: "initiateSocket" })
})

io.on('connection', function(socket){
  console.log('a user connected');
  var userID;

  socket.on('loginSetup', function(id){
     userID = id;
     Users[userID]._socket = socket.id;
    socket.emit('loginDetails',{groups: Groups, channels: Channels, users: Users})
  });

  socket.on('disconnect', function(){
      Users[userID]._socket = null;
      io.emit('User Disconnected', {disconnectedUser: Users[userID]._username, users: Users})
  });
});


var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
