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
		 * Find Users and Update
		 */

		updateUser: function(id, data) {
			models.users.findByIdAndUpdate(id, data, function(error, number, raw) {
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
		getUsers: function(callback) {
			models.user.find({}, function(error, users) {
				if (error) {
					logger.info('items', error);
				}
				callback(users);
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
						    }
					    else
					    	{
						    	models.channel.find({"_groupID" : {"$in": groups}},function(error, channels){ 
							    if(error)
								    { // need to check if data is legit or not here
								       console.log(error);
								    }
							    else
								    {
								    	 resolve({groups: groups, channels:channels, currentUser: user});
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
		deleteUser: function(id) {
			models.users.findByIdAndRemove(id, function(error) {
				if (error) {
					logger.info('items:', error);
				}
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
