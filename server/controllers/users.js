module.exports = function(models, logger,jwt,bcrypt,multer) {

	return {

			/*
			This function takes in the username and password of the user trying to loginVerify
			it will hash the given password and compare with the saved password in the Database using bcrypt
			*/
			loginVerify: async function(data,callback){
	    	return new Promise(function (resolve, reject) {
		      console.log(data.username);
		      models.user.findOne({ _username: data.username }).exec(function (err, user) {
		       if (err) {
		         console.log(err);
		       } else if (!user) {
		       	resolve({ statusCode: "Error", msg: 'User not found.'})
		       // return callback.send({ statusCode: "Error", msg: 'User not found.'});
		       }

		       bcrypt.compare(data.password, user._password, function (err, result) {
		         if (result === true) {
		           const JWTToken = jwt.sign({
		             email: data.email,
		             _id: user._id
		           },
		           'secret',
		           {
		           expiresIn: '2h'
		           });
		           console.log("User Found")
		           resolve({ token: JWTToken, user: user, statusCode: "initiateSocket" })
		           //return callback.send({ token: JWTToken, user: user, statusCode: "initiateSocket" })
		         } else {
		         	resolve({ statusCode: "Error", msg: "Email or Password is incorrect" });
		        //return callback.send({ statusCode: "Error", msg: "Email or Password is incorrect" });
		         }
		       })
		     });
    	});
   },

	 /*
	 Add user to Group
	 */
	 addUsertoGroup: async function(userID, groupID, channelID){
		 console.log(groupID)
		 return new Promise(function(resolve, reject){
			 models.channel.findOne({ _groupID: groupID }).exec(function (err, channel){
				 if(err){reject(err)}
				 else{
					 models.user.findByIdAndUpdate(userID, { $push: {'_inGroup': groupID,'_inChannel': channel._id}}, function(error, number, raw) {
						 if (error) {
							 logger.info('Users', error);
						 }else{
							 resolve({statusCode: "Success", msg: "User added to Group" });
							 console.log("User Added to Group")
						 }
					 });
				 }
			 });
		 });
	 },

	 // Remove user from Group
	 removeUserfromGroup: async function(userID, groupID){
		 return new Promise(function(resolve, reject){
			 models.user.findByIdAndUpdate(userID,{ $pop: {'_inGroup': groupID}}, function(error,number,raw){
				 if(error){
					 console.log(error)
				 }else{
					 resolve({statusCode: "Success", msg: "Group Removed" })
				 }
			 });
		 });
	 },

	 // Remove user from Channel
	 addUsertoChannel: async function(userID, groupID, channelID){
		 return new Promise(function(resolve,reject){
			 models.user.findByIdAndUpdate(userID, { $push: {'_inChannel': channelID}}, function(error, number, raw) {
				 if (error) {
					 logger.info('Users', error);
				 }else{
					 resolve({statusCode: "Success", msg: "User added to Channel" });
					 console.log("User Added to Channel")
				 }
			 });
		 });
	 },

	 /*
	 This function takes in a userID and ChannelID,
	 it will remove the given userID from the channel
	 */
	 removeUserFromChannel: async function(userID, channelID){
		 return new Promise(function(resolve, reject){
			 models.user.findByIdAndUpdate(userID,{ $pop: {'_inChannel': channelID}}, function(error,number,raw){
				 if(error){
					 console.log(error)
				 }else{
					 resolve({statusCode: "Success", msg: "Group Removed" })
				 }
			 });
		 });
	 },

		/*
		 * Find Users and Update
		 */
		updateUser: function(id, data) {
			models.user.findByIdAndUpdate(id, data, function(error, number, raw) {
				if (error) {
					logger.info('Users', error);
				}
			});
		},


		/*
		 * This function will get all users, currently not in use.
		 */
		getUsers: async function(callback) {
			return new Promise(function(resolve,reject){
				models.user.find({}, function(error, users) {
					if (error) {
						logger.info('items', error);
					}
					callback(users);
				});
			});
		},

		/*
	 * This function will get all data that relates to the given userID
	 */
	 getRelevantData: async function(id) {
		return new Promise(function (resolve, reject) {
			models.user.findOne({ _id: id }).exec(function (err, user) {
					 if (err) {
						 console.log(err);
					 } else if (user) {
						models.group.find({"_id" : {"$in" : user._inGroup}},function(error, groups){ // finds all groups where the groups id is in the _inGroup[] array of user
						if(error)
							{ // need to check if data is legit or not here
								 console.log(error);
							} else {
								models.channel.find({"_groupID" : {"$in": groups}},function(error, channels){
								if(error)
									{ // need to check if data is legit or not here
										 console.log(error);
									}
								else
									{
									models.user.find({}, function(error, users) {
										if (error) {
											logger.info('items', error);
										} else{
											var returnGroups = []
													for(var i = 0;i<groups.length;i++){
															returnGroups.push(groups[i]);
															for(var k=0;k<user._inChannel.length;k++){
																	for(var j =0;j<channels.length;j++){
																		 if(user._inChannel[k].equals(channels[j]._id) && groups[i]._id.equals(channels[j]._groupID)){
																			 returnGroups[i]['_channels'].push(channels[j]);
																			 console.log("same");
																		 }
																		 }
																			if(returnGroups[i]['_channels'].length > 0) {
																					returnGroups[i]['_activeChannel'] = returnGroups[i]['_channels'][0]._id;
																			}

																	}
															}
											resolve({groups: returnGroups, channels:channels, currentUser: user, users:users});
										}
									});
									}
								});
							}
						});


					 }
			});
		});
	},

		/*
		 * Create New Users
		 */
		createUser: async function(data) {
			var uploadDIR = '/server/userContent/uploads'
			console.log(data)
			return new Promise(function (resolve, reject) {
				var newUser = new models.user(data);
		    	models.user.findOne({ _username: data._username }).exec(function (err, user) {
		        if (err) {
		          	console.log(err)
		        }else if(user == null){
		          newUser.save(function (error) {
		            if (error) {
		            	console.log(error)
		            }else{
		          	resolve({statusCode: "User", msg: "User Created" });
							}
		          });
		        }else if(user != null){
		          resolve({statusCode: "UserError", msg: "User Already Exists" })
		        }
		    });
    	});


		},

		/*
		 * Delete User by Id
		 */
		deleteUser: async function(id) {
			return new Promise(function(resolve,reject){
				models.users.findByIdAndRemove(id, function(error) {
					if (error) {
						logger.info('items:', error);
					}
					else{
						resolve({statusCode: "Success", msg: "User Deleted" })
					}
				});
			});
		},



		/*
		 * Drop tables
		 *
		 */
		drop: function(callback) {
			models.users.remove({}, function(error) {
				if (callback) {
					callback();
				}
			});
		}
	};
};
