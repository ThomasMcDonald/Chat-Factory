module.exports = function(models, logger,jwt,bcrypt) {

	return {
		createChannel: async function(channel,groupID){
			return new Promise(function (resolve, reject) {
				var newChannel = new models.channel(channel)
				models.group.findByIdAndUpdate(groupID, { $push: {'_inChannel': newChannel._id } },function(error) {
					if(error){
						reject(error);
					}
					else {
						newChannel.save(function(error){
							if(error){
								reject(error)
							}
							else{
								resolve({statusCode: "Success", msg: "Channel Created" })
								}
						});
					}
				});
			});
		}
	}
}
