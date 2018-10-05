module.exports = function(models,controller, app, io) {
    console.log("Socket Module Loaded");
    var Users = []; // Keeps Track of online users
    var Channels = []; // Keeps track of all Channels current being used.
    io.on('connection', function(socket){
      console.log('a user connected');
      var userID;
      var currentUser;

      socket.on('loginSetup', function(user){
          currentUser = user;
          //Users.push({_id: userID, _socket: socket.id})
         (async function(id){
           return await controller.user.getRelevantData(id);
        })(currentUser._id).then(result =>{
          socket.emit('updatedData',{groups: result.groups, users: result.users})
        });
      });

      // Sendds messages to room ID
      socket.on('roomyMessage', function(content){
        if(content.room != null){
            controller.message.createMessage({_channelID: content.room, _content:content.msg, _imgContent:content.img, _time:new Date(), _from: content.from});
            io.in(content.room).emit('message',{status: "message", _channelID: content.room, _content: content.msg, _imgContent:content.img, _time:new Date(), _from: [content.from]})
        }
      });

      // This is run when a user joins the room
      socket.on('subscribe', function(content) {
            console.log('joining room', content.room);
             (async function(room){
           return await controller.message.getMessagesbyChannel(room);
            })(content.room).then(result =>{
              socket.emit('message', {status: "channelContent", content: result})
              io.in(content.room).emit('message',{status: "joined", user: content.user })
              socket.join(content.room);
            });
        })

      socket.on('unsubscribe', function(content) {
        console.log(content);
            console.log('leaving room', content.room);
            socket.leave(content.room);
            io.in(content.room).emit('message',{status: "left", user: content.user })
        })

      socket.on('requestData', function(user){
        (async function(id){
           return await controller.user.getRelevantData(id);
        })(user._id).then(result =>{
          socket.emit('updatedData',{groups: result.groups, users: result.users})
        });
      });

      socket.on('disconnect', function(){
          //io.emit('User Disconnected', {disconnectedUser: Users[userID]._username, users: Users})
          console.log("User Disconnected (Logged out)");
      });
    });
};
