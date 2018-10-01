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
           return await  controller.user.createUser({_email:req.body.email,_username:req.body.username.toLowerCase(),_password:"Super",_role: req.body.role, _profileImage:req.body.profileImg,_inChannel:[],_inGroup:[]})
        })(req,res).then(result =>{
          res.send(result);
          io.emit('newData',{owner:"All"});
        })
    });


    // // Delete given User
    app.post('/deleteUser', function (req, res) {
      (async function(req,res){
        return await controller.user.deleteUser(req.body.userID)
      })(req,res).then(result =>{
        res.send(result);
        io.emit('newData',{owner:"All"});
      });
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
       (async function(req,res){
         return await controller.group.removeGroup(req.body._groupID);
      })(req,res).then(result =>{
        res.send(result);
        io.emit('newData',{owner:"All"});
      });
     });

    // // Remove the given user from the given group or channel
    // // dependent on option given
    app.post('/removeUserFromGroupChannel', function(req, res){
      userID = req.body.userID;
      removedGroupChannel = req.body.removeID;
      option = req.body.option;

      if(option == "Group"){
        (async function(req,res){
           return await controller.user.removeUserfromGroup(userID, removedGroupChannel);
        })(req,res).then(result =>{
          res.send(result);
          io.emit('newData',{owner:userID});
        });
       }
       else if(option == "Channel"){
         (async function(req,res){
           return await controller.user.removeUserFromChannel(userID, removedGroupChannel);
        })(req,res).then(result =>{
          res.send(result);
          io.emit('newData',{owner:userID});
        });

       }
     });



    // // Add user to either a Group or a channel, in most cases if a user is added to a channels
    // // They will be added to the Group as well, this is for potential error handling
     app.post('/addUsertoGroupChannel', function (req, res) {
       userID = req.body.userID;
       channelID = req.body.channelID;
       groupID = req.body.groupID;
       option = req.body.option
       if(option == "Group"){
         (async function(req,res){
            return await controller.user.addUsertoGroup(userID, groupID,channelID);
         })(req,res).then(result =>{
           res.send(result);
           io.emit('newData',{owner:userID});
         });
        }
        else if(option == "Channel"){
          (async function(req,res){
            return await controller.user.assUsertoChannel(userID, groupID,channelID);
         })(req,res).then(result =>{
           res.send(result);
           io.emit('newData',{owner:userID});
         });

        }
      });


    //
    // // Channel Routes
    //
    // Create Channel
    app.post('/createChannel', function (req, res) {
      console.log(req.body.owner);
      (async function(req,res){
        return await controller.channel.createChannel({_name:req.body.name, _topic:req.body.topic, _groupID: req.body.groupID}, req.body.groupID,req.body.owner);
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
    });
};
