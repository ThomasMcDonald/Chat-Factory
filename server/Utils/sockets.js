module.exports = function(models,controller, app, io) {
    console.log("Socket Module Loaded");
    var Users = [];
    
    io.on('connection', function(socket){
      console.log('a user connected');
      var userID;
      var currentUser;
      
      socket.on('loginSetup', function(id){
          userID = id;
          
         (async function(id){
           return await controller.user.getRelevantData(id);
        })(id).then(result =>{
          var groups = [];
          for(var i = 0;i<result.groups.length;i++){
            groups.push(result.groups[i]);
            for(var j =0;j<result.channels.length;j++){
               if(result.groups[i]._id.equals(result.channels[j]._groupID)){
                 groups[i]['_channels'].push(result.channels[j]);
               }
               }
                if(groups[i]['_channels'].length > 0) {
                   groups[i]['_activeChannel'] = groups[i]['_channels'][0]._id;
                }
              
            }
          socket.emit('updatedData',{groups: groups, users: Users})
        });
      });
    
      socket.on('roomyMessage', function(content){
        console.log(content)
        controller.message.createMessage({_channelID: content.room, _content:content.msg, time:new Date()});
        io.in(content.room).emit('message',{status: "message", user: Users[userID], content: content.msg })
      });
    
      socket.on('subscribe', function(room) {
            console.log('joining room', room);
            
             (async function(room){
           return await controller.message.getMessagesbyChannel(room);
            })(room).then(result =>{
              socket.emit('message', {status: "channelContent", content: result})
              io.in(room).emit('message',{status: "joined", user: Users[userID] })
              socket.join(room);
            });
        })
    
      socket.on('unsubscribe', function(room) {
            console.log('leaving room', room);
            socket.leave(room);
            io.in(room).emit('message',{status: "left", user: Users[userID] })
        })
    
      socket.on('requestData', function(id){
         currentUser = Users[id];
        
       // socket.emit('updatedData',{groups: userGroups, users: Users})
      });
    
      socket.on('disconnect', function(){
          //io.emit('User Disconnected', {disconnectedUser: Users[userID]._username, users: Users})
          console.log("User Disconnected (Logged out)");
      });
});


    
};