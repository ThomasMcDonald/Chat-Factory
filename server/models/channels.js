/*
This file defines the mongoose schema for the Channel.
*/


module.exports = function(mongoose, bcrypt) {

var channelSchema =  mongoose.Schema({
  _name: {
    type: String,
    required: true,
    trim: true
  },
  _topic: {
    type: String,
    required: true,
  },
  _groupID:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  }
});

var Channel = mongoose.model('Channel', channelSchema);
return Channel;
};
