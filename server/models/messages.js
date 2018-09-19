
module.exports = function(mongoose) {

var messageSchema =  mongoose.Schema({
    _channelID: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Channel',
    required:true
  },
    _content: {
    type: String,
    required: true,
    trim: true
  },
  _time: {
      type: String,
  },
  _from: {
    type: Array,
  }
});


var Message = mongoose.model('Message', messageSchema);
return Message;
};
