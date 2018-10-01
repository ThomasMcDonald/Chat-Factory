

module.exports = function(mongoose, bcrypt) {

var userSchema =  mongoose.Schema({
  _email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  _username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  _password: {
    type: String,
    required: true,
  },
  _role:{
    type: String,
    required: true,
  },
  _profileImage:{
    type: String,
    required: true
  },
  _inChannel:{
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
  },
  _inGroup:{
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  }
});

//hashing a password before saving it to the database
userSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user._password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user._password = hash;
    next();
  })
});

var User = mongoose.model('User', userSchema);
return User;
};
