
module.exports = function(mongoose) {

var groupSchema =  mongoose.Schema({
  _name: {
    type: String,
    required: true,
    trim: true
  },
  _topic: {
    type: String,
    required: true,
    trim: true
  },
  _channels:{
    type: Array
  },
  _activeChannel: {
    type: Number
  }
});


var Group = mongoose.model('Group', groupSchema);
return Group;
};
