module.exports = function(models,controller, app, express, io) {


    console.log("Routes Module Loaded")

    app.get('/', function(req,res){
     res.sendFile(express.static(__dirname + '/dist/Chat-Factory'));
    });


    //
    // // User Routes
    //
    // // Verify the login details provided with the User Array. There is no actual authentication, just check if username exists in array.
    app.post('/loginVerify', function (req, res) {
      (async function(req,res){
         return await controller.user.loginVerify(req.body,res);
      })(req,res).then(result =>{
        res.send(result);
      })
    })

    // // Create new user function, will throw error if user already exists
    app.post('/createUser', function (req, res) {
        (async function(req,res){
           return await  controller.user.createUser({_email:req.body.email,_username:req.body.username.toLowerCase(),_password:"Super",_role: req.body.role,_inChannel:[],_inGroup:[]})
        })(req,res).then(result =>{
          res.send(result);
          io.emit('newData');
        })
    });


    // // Delete given User
    app.post('/deleteUser', function (req, res) {
    //   for(var i=0;i<Users.length;i++){
    //     if(Users[i]._id == req.body.userID){
    //       Users.splice(req.body.userID,1);
    //     }
    //   }
    //
    //   res.send({statusCode: "Success", msg: "User Deleted" })
    //   io.emit('newData');
    //   fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
    //     if (err) throw err;
    //   });
    });


    // // Group routes
    //
    // Create Group
    app.post('/createGroup', function (req, res) {
         (async function(req,res){
           return await controller.group.createGroup(req.body.owner,{_name: req.body.name, _topic:req.body.topic,_channels: []},{_name: "General", _topic:"General chat"});
        })(req,res).then(result =>{
          res.send(result);
          io.emit('newData',{owner:req.body.owner});
        });
    });

    //
    // // Remove given Group, Channels within that group, and inChannel elements in the User array
     app.post('/removeGroup', function (req, res) {
    //   removedGroup = req.body._groupID;
    //   removedChannels = [];
    //
    //   for(var i=0;i<Channels.length;i++){
    //     if(Channels[i]._groupID == removedGroup){
    //       removedChannels.push(Channels[i]._id);
    //       Channels.splice(i,1);
    //     }
    //   }
    //   // Remove Channels from Users _inChannel array
    //   for(var i=0;i<Users.length;i++){
    //     for(var k=0;k<Users[i]._inChannel.length;k++){
    //       for(var j=0;j<removedChannels.length;j++){
    //       if(Users[i]._inChannel[k] == removedChannels[j]){
    //         Users[i]._inChannel.splice(k,1);
    //         Users[i]
    //         }
    //       }
    //     }
    //     //Remove Group from Users _inGroup array
    //     for(var l=0;l<Users[i]._inGroup.length;l++){
    //       if(Users[i]._inGroup[l] == removedGroup){
    //         Users[i]._inGroup.splice(l,1);
    //         }
    //     }
    //   }
    //
    //   for(var i=0;i<Groups.length;i++){
    //     if(Groups[i]._id == removedGroup){
    //       Groups.splice(i,1);
    //     }
    //   }
    //
    //
    //   res.send({statusCode: "Success", msg: "Group Removed" })
    //   io.emit('newData');
    //   fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
    //   if (err) throw err;
    // });
     });

    // // Remove the given user from the given group or channel
    // // dependent on option given
    app.post('/removeUserFromGroupChannel', function(req, res){
    //   removedGroupChannel = req.body.removeID;
    //   option = req.body.option;
    //   userID = req.body.userID;
    //   removedChannels = [];
    //   if(option == "Channel"){
    //
    //     for(var i = 0;i<Users[userID]._inChannel.length;i++){
    //       if(Users[userID]._inChannel[i] == removedGroupChannel){
    //         Users[userID]._inChannel.splice(i,1);
    //       }
    //     }
    //   }
    //   else if(option == "Group"){
    //     for(var i=0;i<Channels.length;i++){
    //       if(Channels[i]._groupID == removedGroupChannel){
    //         removedChannels.push(Channels[i]._id);
    //       }
    //     }
    //       for(var j=0;j<removedChannels.length;j++){
    //         for(var k=0;k<Users[i]._inChannel.length;k++){
    //         if(Users[userID]._inChannel[k] == removedChannels[j]){
    //           Users[userID]._inChannel.splice(k,1);
    //           }
    //         }
    //     }
    //     for(var i = 0;i<Users[userID]._inGroup.length;i++){
    //       if(Users[userID]._inGroup[i] == removedGroupChannel){
    //         Users[userID]._inGroup.splice(i,1);
    //       }
    //     }
    //   }
    //
    //
    //
    //   res.send({statusCode: "Success", msg: "Group Removed" })
    //   io.emit('newData');
    //   fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
    //   if (err) throw err;
    //   });
     });
    //
    // // Add user to either a Group or a channel, in most cases if a user is added to a channels
    // // They will be added to the Group as well, this is for potential error handling
     app.post('/addUsertoGroupChannel', function (req, res) {
    //   groupChannelID = req.body.channelID;
    //   userID = req.body.userID;
    //   option = req.body.option
    //   inGroup = false;
    //
    //   if(option == "Group"){
    //     for(var i=0;i<Users[userID]._inGroup.length;i++){
    //       if(Users[userID]._inGroup[i] == groupChannelID){
    //         inGroup = true;
    //       }
    //     }
    //     if(inGroup){res.send({statusCode: "Error", msg: "User Already in Group" })}
    //     else{
    //       Users[userID]._inGroup.push(groupChannelID);
    //     }
    //
    //   } else if(option == "Channel"){
    //     //opted in to just adding user to the group if they arent already
    //     Users[userID]._inChannel.push(groupChannelID);
    //     for(var i=0;i<Users[userID]._inChannel.length;i++){
    //       if(Users[userID]._inGroup[i] == Channels[groupChannelID]._owner){
    //         inGroup = true;
    //       }
    //     }
    //     if(!inGroup){
    //       Users[userID]._inGroup.push(Channels[groupChannelID]._owner);
    //     }
    //   }
    //     res.send({statusCode: "Success", msg: "User added to " + option })
    //     io.emit('newData');
    //     fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
    //     if (err) throw err;
    //     });
    //
     });


    //
    // // Channel Routes
    //
    // Create Channel
    app.post('/createChannel', function (req, res) {
      (async function(req,res){
        return await controller.channel.createChannel({_name:req.body.name, _topic:req.body.topic, _groupID: req.body.groupID}, req.body.groupID);
     })(req,res).then(result =>{
       res.send(result);
       io.emit('newData',{owner:req.body.owner});
     });
    });

    // // Remove Given Channel
    app.post('/removeChannel', function (req, res) {
      (async function(req,res){
        return await controller.channel.removeChannel(req.body.channelID,req.body.groupID);
      })(req,res).then(result =>{
        res.send(result);
        io.emit('newData',{owner:"All"});
      });
    //   for(var i=0;i<Users.length;i++){
    //     for(var j=0;j<Users[i]._inChannel.length;j++){
    //         if(Users[i]._inChannel[j] == req.body.channelID){
    //           Users[i]._inChannel.splice(j,1);
    //         }
    //       }
    //     }
    //
    //   for(var i=0;i<Channels.length;i++){
    //     if(Channels[i]._id == req.body.channelID){
    //         Channels.splice(i,1);
    //     }
    //   }
    //
    //     res.send({statusCode: "Success", msg: "Channel Deleted" })
    //     io.emit('newData');
    //     fs.writeFile('./server/Utils/serverCache.txt', JSON.stringify({groups: Groups, channels: Channels, users: Users}), (err) => {
    //     if (err) throw err;
    //   });
    });
};
