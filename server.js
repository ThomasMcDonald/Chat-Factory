var express = require('express')
var bodyParser = require('body-parser')

var app = express()
var http = require('http').Server(app)
var bodyPaser = bodyParser.json()
var port = process.env.PORT || 8080;

var Group = require('./server/models/group');
var Channel = require('./server/models/channel');
var User = require('./server/models/user');

var Groups = [];
var Channels = [];
var Users = [];
var count = 0;
var Ucount = 1;

Users.push(new User(0,"Super","Super@gmail.com","Super"));
Groups.push(new Group(0,"Meme Group","memes",0));

app.use(express.static(__dirname + '/dist/Chat-Factory'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyPaser);
app.get('/', function(req,res){
    res.sendFile(express.static(__dirname + '/dist/Chat-Factory'));
});


var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Listening on %s", port)
})
var io = require('socket.io').listen(server);


app.post('/loginVerify', function (req, res) {
    var realUser = { status: false, id:0 };
    for(i=0;i<Users.length;i++){
        if(Users[i]._username == req.body.username){
            realUser.status = true;
            realUser.id = i;
            break;
        }
    }
    if(!realUser.status){
        return res.send({statusCode: "UserError", msg: "User doesnt Exist" })
     //Users.push(new User(Ucount,req.body.username,"Peasant"));
     //Ucount++;
    // return res.send({ user: Users[Users.length-1], statusCode: "initiateSocket" })
    }
    else{
      return res.send({ user: Users[realUser.id], statusCode: "initiateSocket" })
    }
})



app.post('/createUser', function (req, res) { 
    console.log(req.body)
    for(var i=0;i<Users.length;i++){
        if(Users[i]._username == req.body.username){
              return res.send({statusCode: "UserError", msg: "User Already Exists" })
        }
    }
    Users.push(new User(Ucount,req.body.username,req.body.email,req.body.role));
    Ucount++;
    res.send({statusCode: "User", msg: "User Created" })
    io.emit('newUser',{users: Users})
});

io.on('connection', function(socket){
  console.log('a user connected');
  var userID;

  socket.on('loginSetup', function(id){
     userID = id;
     Users[userID]._socket = socket.id;
    socket.emit('loginDetails',{groups: Groups, channels: Channels, users: Users})
  });

  socket.on('disconnect', function(){
      Users[userID]._socket = '';
      io.emit('User Disconnected', {disconnectedUser: Users[userID]._username, users: Users})
      console.log("User Disconnected (Logged out)");
  });
});
