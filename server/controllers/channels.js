module.exports = function(models, logger,jwt,bcrypt) {

	return {
		createChannel:function(channel,groupID){
			var newChannel = new models.channel(channel)
			newChannel.save(function(error){
				if(error){
					console.log(error)
				}
				else{
					console.log("Channel Added")
				}
			});
		}
	};
};
