module.exports = function(models, logger,jwt,bcrypt) {

	return {
		createMessage: function(content){
			var newMessage = new models.message(content);
			 newMessage.save(function (error) {
		            if (error) {
		            	console.log(error)
		            }else{
		          	console.log({statusCode: "Message", msg: "Message Added" });
							}
		          });
		},
		
		getMessagesbyChannel: async function(channelID) {
			return new Promise(function (resolve, reject) {
				models.message.find({_channelID: channelID}).exec(function (err, messages) {
			       if (err) {
			         console.log(err);
			       } else if (messages) {
			       	resolve(messages);
			       }
				});
			});
		}
		
	};
};
