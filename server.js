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

// Verify the login details provided with the User Array. There is no actual authentication, just check if username exists in array.
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
        return res.send({statusCode: "Error", msg: "User doesnt Exist" })
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
    Users.push(new User(Users.length,req.body.username.toLowerCase(),req.body.email,req.body.role,[],[]));
    res.send({statusCode: "User", msg: "User Created" })
    io.emit('newUser',{users: Users})
    fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
    if (err) throw err;
});
});

// Update User details
app.put('/updateUser', function (req, res) {
    console.log(req.body)
    // Just send the entire User object or ID to this route and it can be used in all update instances, not just role update.
});

// Delete given User
app.delete('/removeUser', function (req, res) {
    console.log(req.body)
    // Just send the entire User object or ID to this route and it can be used in all update instances, not just role update.
});

// Group routes

// Create Group
app.post('/createGroup', function (req, res) {
  console.log("new group")
  GroupID = Groups.length;
  
  Groups.push(new Group(GroupID,req.body.name,req.body.topic,req.body.owner));
  Users[req.body.owner]._inGroup.push(GroupID); // Add group creator to Group
  if(req.body.owner != 0){
      Users[0]._inGroup.push(GroupID); // Add Super user to Group
  }


  userGroups = usersGroups(Users[req.body.owner], Groups);

  res.send({statusCode: "Success", groups: userGroups })
  io.emit('newData');
  fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
  if (err) throw err;
});
});

// Get Group by ID
app.post('/getGroup', function (req, res) {
     return res.send({ currentGroup: Groups[req.body.groupID], statusCode: "Success" })
});

// Update details of given Group
app.put('/updateGroup', function (req, res) {
    console.log(req.body)
});

// Remove given Group, Channels within that group, and inChannel elements in the User array
app.post('/removeGroup', function (req, res) {
  console.log(req.body);
  removedGroup = req.body._groupID;
  removedChannels = [];
  for(var i=0;i<Channels.length;i++){
    if(Channels[i]._groupID == removedGroup){
      Channels.splice(i,1);
      removedChannels.push(i);
    }
  }
  for(var i=0;i<Users.length;i++){
    for(var j=0;j<removedChannels.length;j++){
      for(var k=0;k<Users[i]._inChannel.length;k++){
      if(Users[i]._inChannel[k] == removedChannels[j]){
        Users[i]._inChannel.splice(k,1);
        }
      }
    }
  }

  Groups.splice(removedGroup,1);

  res.send({statusCode: "Success", msg: "Group Removed" })
  io.emit('newData');
  fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
  if (err) throw err;
});
});

// Add the Given User to the given Group
app.post('/addUserToGroup', function(req, res){
    console.log(req.body);
});

// Remove the given user from the given group
app.post('/removeUserFromGroup', function(req, res){
    console.log(req.body);
});


// Channel Routes

// Create Channel
app.post('/createChannel', function (req, res) {
  console.log(req.body)
  Channels.push(new Channel(Channels.length,req.body.name,req.body.topic,req.body.groupID,req.body.owner));
  Users[req.body.owner]._inChannel.push(Channels.length); // Adds user that created channel into channel
  Users[0]._inChannel.push(Channels.length); // Adds the Super user to the Channel
  res.send({statusCode: "Success", msg: "Channel Created" })
  io.emit('newData');
  fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
  if (err) throw err;
});
});

// Update give channels details
app.put('/updateChannel', function (req, res) {
    console.log(req.body)
});

// Remove Given Channel
app.post('/removeChannel', function (req, res) {
    console.log(req.body)
    Channels.splice(req.body._channelID,1);
    res.send({statusCode: "Success", msg: "Channel Deleted" })


    io.emit('newData');
    fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
    if (err) throw err;
  });
});


// Socket Functionality
io.on('connection', function(socket){
  console.log('a user connected');
  var userID;

  socket.on('loginSetup', function(id){
     userID = id;
     currentUser = Users[userID];
     currentUser._socket = socket.id;
     userChannels = usersChannels(currentUser, Channels);
     userGroups = usersGroups(currentUser, Groups);

    socket.emit('loginDetails',{groups: userGroups, channels: userChannels, users: Users})
  });

  socket.on('requestData', function(id){
     userID = id;
     currentUser = Users[userID];
     userGroups = usersGroups(currentUser, Groups);
     userChannels = usersChannels(currentUser, Channels);

     console.log("requested update")
    socket.emit('updatedData',{groups: userGroups, channels: userChannels, users: Users})
  });

  socket.on('disconnect', function(){
      Users[userID]._socket = '';
      io.emit('User Disconnected', {disconnectedUser: Users[userID]._username, users: Users})
      console.log("User Disconnected (Logged out)");
  });
});


function usersChannels(currentUser,channels) {
  userChannels = [];
  console.log("User Channels", currentUser);

  if(currentUser._inChannel != undefined){
    for(var i=0;i<Channels.length;i++){
      for(var j=0;j<currentUser._inChannel.length;j++){
        if(currentUser._inChannel[j] == Channels[i]._id){
          userChannels.push(Channels[i]);
        }
      }
    }
  }

  return userChannels;
}

function usersGroups(currentUser, Groups){
  userGroups = []
  console.log("User Groups", currentUser);

  if(currentUser._inGroup != undefined){
    for(var i=0;i<Groups.length;i++){
      for(var j=0;j<currentUser._inGroup.length;j++){
        if(currentUser._inGroup[j] == Groups[i]._id){
          userGroups.push(Groups[i]);
        }
      }
    }
  }
  return userGroups;
}

//
// Reads in the server data and assigns the contents to the appropriate variables
// Loop over the Users array to remove any socket data that may be present, no socket connections will be present when server is starting up.
//
function loadserverCache () {
    var data = fs.readFileSync('./server/Utils/serverCache.txt','utf8')
    if(data == '') {
        Users.push(new User(Users.length,"super","super@gmail.com","Super",[0,1],[0,1]));
        Users.push(new User(Users.length,"default","default@gmail.com","Regular",[],[]));
        Groups.push(new Group(Groups.length,"Calamari Race Team","Squad Tings",0));
        Groups.push(new Group(Groups.length,"REcipe","Cooking leaflets",1));
        Channels.push(new Channel(Channels.length,"General","General Chat",0,0));

        fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
        if (err) throw err;
      });
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
