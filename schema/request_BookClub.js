var mongoose = require('mongoose');

var requestSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  bookId: String,
  bookName:String,
  bookOwner: String,
  requester:String,
  isAccepted: Boolean,
  reqDate: Date,
});

var request = mongoose.model('Request_BookClub', requestSchema);

module.exports = request;