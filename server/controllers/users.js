module.exports = function(models, logger,jwt,bcrypt) {

	return {


    loginVerify: function(data,callback){
      console.log(data.username);
      models.user.findOne({ _username: data.username }).exec(function (err, user) {
       if (err) {
         console.log(err);
       } else if (!user) {
        return callback.send({ statusCode: "Error", msg: 'User not found.'});
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
           return callback.send({ token: JWTToken, user: user, statusCode: "initiateSocket" })
         } else {
        return callback.send({ statusCode: "Error", msg: "Email or Password is incorrect" });
         }
       })
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
		getRelevantData: function(id, callback) {
			models.user.findById(id, function(error, user) {
				if (error) {
					logger.info('Users', error);
				}else if(user){
        console.log(user)
        callback.emit('updatedData',{groups: [], users: []})
      }else{
        console.log("What the fuck");
      }
			});
		},

		/*
		 * Create New Users
		 */
		createUser: function(data) {
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
          	console.log("User Added");
					}
          });
        }else if(user != null){
          console.log("User Already Exists");
        }

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
