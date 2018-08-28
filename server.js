var express = require('express')
var bodyParser = require('body-parser')

var app = express()
var http = require('http').Server(app)
var bodyPaser = bodyParser.json()
const fs = require('fs');
var port = process.env.PORT || 8080;

var Group = require('./server/models/group');
var Channel = require('./server/models/channel');
var User = require('./server/models/user');

var Groups = [];
var Channels = [];
var Users = [];

try {
  fs.accessSync('./server/Utils/serverCache.txt');
} catch (e) {
 fs.closeSync(fs.openSync('./server/Utils/serverCache.txt', 'w'));
}

loadserverCache()

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



// User Routes
app.post('/loginVerify', function (req, res) {
    var realUser = { status: false, id:0 };
    for(var i=0;i<Users.length;i++){
        if(Users[i]._username == req.body.username.toLowerCase()){
            realUser.status = true;
            realUser.id = i;
            break;
        }
    }
    if(!realUser.status){
        return res.send({statusCode: "UserError", msg: "User doesnt Exist" })
    }
    else{
      return res.send({ user: Users[realUser.id], statusCode: "initiateSocket" })
    }
})

// Create new user function, will throw error if user already exists
app.post('/createUser', function (req, res) {
    for(var i=0;i<Users.length;i++){
        if(Users[i]._username == req.body.username.toLowerCase()){
              return res.send({statusCode: "UserError", msg: "User Already Exists" })
        }
    }
    Users.push(new User(Users.length,req.body.username.toLowerCase(),req.body.email,req.body.role));
    res.send({statusCode: "User", msg: "User Created" })
    io.emit('newUser',{users: Users})
    fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
    if (err) throw err;
});
});

app.put('/updateUser', function (req, res) {
    console.log(req.body)
    // Just send the entire User object or ID to this route and it can be used in all update instances, not just role update.
});

app.delete('/removeUser', function (req, res) {
    console.log(req.body)
    // Just send the entire User object or ID to this route and it can be used in all update instances, not just role update.
});

// Group routes
app.post('/createGroup', function (req, res) {

  Groups.push(new Group(Groups.length,req.body.name,req.body.topic,req.body._id,[]));
  res.send({statusCode: "Success", msg: "Group Created" })
  io.emit('newGroup',{groups: Groups})
  fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
  if (err) throw err;
});
});

app.post('/getGroup', function (req, res) {
     return res.send({ currentGroup: Groups[req.body.groupID], statusCode: "Success" })
});

app.put('/updateGroup', function (req, res) {
    console.log(req.body)
    // Just send the entire User object or ID to this route and it can be used in all update instances, not just role update.
});

app.delete('/removeGroup', function (req, res) {
    console.log(req.body)
    // Just send the entire User object or ID to this route and it can be used in all update instances, not just role update.
});


// Channel Routes
app.post('/createChannel', function (req, res) {
    console.log(req.body)
});

app.put('/updateChannel', function (req, res) {
    console.log(req.body)
    // Just send the entire User object or ID to this route and it can be used in all update instances, not just role update.
});

app.delete('/removeChannel', function (req, res) {
    console.log(req.body)
    // Just send the entire User object or ID to this route and it can be used in all update instances, not just role update.
});


// Socket Functionality
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




//
// Reads in the server data and assigns the contents to the appropriate variables
// Loop over the Users array to remove any socket data that may be present, no socket connections will be present when server is starting up.
//
function loadserverCache () {
    var data = fs.readFileSync('./server/Utils/serverCache.txt','utf8')
    if(data == '') {
        Users.push(new User(Users.length,"super","super@gmail.com","Super"));
        Groups.push(new Group(Groups.length,"Christian Minecraft Server","memes",0));
        Groups.push(new Group(Groups.length,"Chef Things","Cooking leaflets",0));
        Channels.push(new Channel(Channels.length,"General","General Chat",0,0));
        return { Users, Groups, Channels };
    }

    data = JSON.parse(data)
    Groups = data.groups;
    Channels = data.channels;
    Users = data.users;

    for(var i=0;i<Users.length;i++){
        if(Users[i]._socket !== undefined){
            delete Users[i]._socket;
          }
      }
      return { Users, Groups, Channels };
}
