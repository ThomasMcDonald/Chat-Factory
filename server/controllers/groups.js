module.exports = function(models, logger,jwt,bcrypt) {

	return {

		// Create Group and Add a default channel to the group and the group creator to that group and channel

		// Still need to check if owner is super user or not, if not Super user needs to be added to group and channel
		createGroup: function(owner,group,channel,res) {
			var newGroup = new models.group(group);
					newGroup.save(function (error) {
						if (error) {
							console.log(error)
						}else{
							channel._groupID = newGroup._id
							var newChannel = new models.channel(channel)
							newChannel.save(function(error){
								if(error){
									console.log(error)
								}
								else{
									models.user.findByIdAndUpdate(owner, { $push: {'_inChannel': newChannel._id,'_inGroup': newGroup._id}}, function(error, number, raw) {
										if (error) {
											logger.info('Users', error);
										}else{
											console.log("Owner Added to Groups")
										}
									});
									console.log("Channel Added")
								}
							});
							console.log("Group Added");
						return res.send({statusCode: "Success", msg: "Group Created" })
					}
					});
			}
		}
};
