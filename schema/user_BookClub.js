var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  id:mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
  email: String,
  city:{type: String, default: undefined},
  region: {type: String, default: undefined},
  country: {type: String, default: undefined},
  
});

var user = mongoose.model('User_BookClub', userSchema);

module.exports = user; 