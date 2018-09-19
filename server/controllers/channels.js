module.exports = function(models, logger,jwt,bcrypt) {

	return {
		createChannel: async function(channel,groupID,userID){
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
								models.user.findByIdAndUpdate(userID,{ $push: {'_inChannel': newChannel._id } }, function(error){
									if(error){
										reject(error)
									}
									else{
										resolve({statusCode: "Success", msg: "Channel Created" })
									}
								});

								}
						});
					}
				});
			});
		},

		removeChannel: async function(channelID,groupID){
			return new Promise(function (resolve, reject) {
				models.channel.findByIdAndRemove(channelID, function(err) {
						if (err) throw err;
						else {
							models.group.findByIdAndUpdate(groupID,{$pull:{_channels: channelID}},function(error){
								if (error) throw error;
								else {
									resolve({statusCode: "Success", msg: "Channel Deleted" });
								}
							});
						}
				});
			});
		}



	}
}
