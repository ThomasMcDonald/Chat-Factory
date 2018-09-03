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
    userID = Users[Users.length-1]._id + 1;
    for(var i=0;i<Users.length;i++){
        if(Users[i]._username == req.body.username.toLowerCase()){
              return res.send({statusCode: "UserError", msg: "User Already Exists" })
        }
    }
    Users.push(new User(userID,req.body.username.toLowerCase(),req.body.email,req.body.role,[],[]));
    res.send({statusCode: "User", msg: "User Created" })
    io.emit('newUser',{users: Users})
    fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
    if (err) throw err;
});
});

// Delete given User
app.post('/deleteUser', function (req, res) {

  for(var i=0;i<Users.length;i++){
    if(Users[i]._id == req.body.userID){
      Users.splice(req.body.userID,1);
    }
  }

  res.send({statusCode: "Success", msg: "User Deleted" })
  io.emit('newData');
  fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
  if (err) throw err;
});

});

// Group routes

// Create Group
app.post('/createGroup', function (req, res) {
  GroupID = Groups[Groups.length-1]._id + 1;

  Groups.push(new Group(GroupID,req.body.name,req.body.topic,req.body.owner));
  Users[req.body.owner]._inGroup.push(GroupID); // Add group creator to Group
  if(req.body.owner != 0){
      Users[0]._inGroup.push(GroupID); // Add Super user to Group
  }

  res.send({statusCode: "Success", msg: "Group Created" })
  io.emit('newData');
  fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
  if (err) throw err;
});
});

// Get Group by ID
app.post('/getGroup', function (req, res) {
     return res.send({ currentGroup: Groups[req.body.groupID], statusCode: "Success" })
});

// Remove given Group, Channels within that group, and inChannel elements in the User array
app.post('/removeGroup', function (req, res) {
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

  for(var i=0;i<Groups.length;i++){
    if(Groups[i]._id == removedGroup){
      Groups.splice(removedGroup,1);
    }
  }


  res.send({statusCode: "Success", msg: "Group Removed" })
  io.emit('newData');
  fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
  if (err) throw err;
});
});


// Remove the given user from the given group or channel
// dependent on option given
app.post('/removeUserFromGroupChannel', function(req, res){
  removedGroupChannel = req.body.removeID;
  option = req.body.option;
  userID = req.body.userID;
  console.log(req.body);
  removedChannels = [];
  if(option == "Channel"){
    
    for(var i = 0;i<Users[userID]._inChannel.length;i++){
      if(Users[userID]._inChannel[i] == removedGroupChannel){
        
        Users[userID]._inChannel.splice(i,1);
      }
    }
  }
  else if(option == "Group"){
    for(var i=0;i<Channels.length;i++){
      if(Channels[i]._groupID == removedGroupChannel){
        removedChannels.push(i);
      }
    }
      for(var j=0;j<removedChannels.length;j++){
        for(var k=0;k<Users[i]._inChannel.length;k++){
        if(Users[userID]._inChannel[k] == removedChannels[j]){
          Users[userID]._inChannel.splice(k,1);
          }
        }
    }
    for(var i = 0;i<Users[userID]._inGroup.length;i++){
      if(Users[userID]._inGroup[i] == removedGroupChannel){
        Users[userID]._inGroup.splice(i,1);
      }
    }
  }



  res.send({statusCode: "Success", msg: "Group Removed" })
  io.emit('newData');
  fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
  if (err) throw err;
  });
});

// Add user to either a Group or a channel, in most cases if a user is added to a channels
// They will be added to the Group as well, this is for potential error handling
app.post('/addUsertoGroupChannel', function (req, res) {
  groupChannelID = req.body.channelID;
  userID = req.body.userID;
  option = req.body.option
  inGroup = false;
  if(option == "Group"){
    for(var i=0;i<Users[userID]._inGroup.length;i++){
      if(Users[userID]._inGroup[i] == groupChannelID){
        inGroup = true;
      }
    }
    if(inGroup){res.send({statusCode: "Error", msg: "User Already in Group" })}
    else{
      Users[userID]._inGroup.push(groupChannelID);
    }

  } else if(option == "Channel"){
    //opted in to just adding user to the group if they arent already
    Users[userID]._inChannel.push(groupChannelID);
    for(var i=0;i<Users[userID]._inChannel.length;i++){
      if(Users[userID]._inGroup[i] == Channels[groupChannelID]._owner){
        inGroup = true;
      }
    }
    if(!inGroup){
      Users[userID]._inGroup.push(Channels[groupChannelID]._owner);
    }
  }
    res.send({statusCode: "Success", msg: "User added to " + option })
    io.emit('newData');
    fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
    if (err) throw err;
    });

});

// Channel Routes

// Create Channel
app.post('/createChannel', function (req, res) {
  channelID = Channels[Channels.length-1]._id + 1;
  Channels.push(new Channel(channelID,req.body.name,req.body.topic,req.body.groupID,req.body.owner));
  Users[req.body.owner]._inChannel.push(channelID); // Adds user that created channel into channel
  if(req.body.owner != 0) {
    Users[0]._inChannel.push(channelID); // Adds the Super user to the Channel
  }

  res.send({statusCode: "Success", msg: "Channel Created" })
  io.emit('newData');
  fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
  if (err) throw err;
  });
});

// Remove Given Channel
app.post('/removeChannel', function (req, res) {
  for(var i=0;i<Users.length;i++){
    for(var j=0;j<Users[i]._inChannel.length;j++){
        if(Users[i]._inChannel[j] == req.body.channelID){
          Users[i]._inChannel.splice(j,1);
        }
      }
    }

  for(var i=0;i<Channels.length;i++){
    if(Channels[i]._id == req.body.channelID){
        Channels.splice(i,1);
    }
  }

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
     userChannels = usersChannels(currentUser);
     userGroups = usersGroups(currentUser);

    socket.emit('loginDetails',{groups: userGroups, channels: userChannels, users: Users})
  });

  socket.on('requestData', function(id){
     currentUser = Users[id];
     userGroups = usersGroups(currentUser);
     userChannels = usersChannels(currentUser);
    socket.emit('updatedData',{groups: userGroups, channels: userChannels, users: Users})
  });

  socket.on('disconnect', function(){
      Users[userID]._socket = '';
      io.emit('User Disconnected', {disconnectedUser: Users[userID]._username, users: Users})
      console.log("User Disconnected (Logged out)");
  });
});

// Filters the Channels array
// Returns only the channels the user is in
function usersChannels(currentUser) {
  userChannels = [];

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

// Filters the Groups array
// Returns only the Groups the user is in
function usersGroups(currentUser){
  userGroups = [];
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
        Users.push(new User(0,"super","super@gmail.com","Super",[0],[0]));
        Users.push(new User(1,"default","default@gmail.com","Regular",[],[]));
        Groups.push(new Group(0,"Calamari Race Team","Squad Tings",0));
        Channels.push(new Channel(0,"General","General Chat",0,0));

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
