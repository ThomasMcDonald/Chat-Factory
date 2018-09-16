module.exports = function(models, logger,jwt,bcrypt) {

	return {


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
	 addUsertoGroup: async function(userID, groupID){
		 return new Promise(function(resolve, reject){
			 models.user.findByIdAndUpdate(userID, { $push: {'_inGroup': groupID}}, function(error, number, raw) {
				 if (error) {
					 logger.info('Users', error);
				 }else{
					 resolve({statusCode: "Success", msg: "User added to Group" });
					 console.log("User Added to Group")
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
	 addUsertoChannel: async function(userID, channelID){
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
		 * Items Methods
		 */

		/*
		 * Get All Users
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
		 * Find Users By Id
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
														resolve({groups: groups, channels:channels, currentUser: user, users:users});
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
			return new Promise(function (resolve, reject) {
				console.log(data);
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
