var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  author: String,
  short_desc: {type:String, default: undefined},
  image: {type:String, default: undefined},
  link: {type:String, default: undefined},
  volumeId: String,
  category: String,
  addedBy: String,
  addedOn: Date,
  onTrade: false
});

var book = mongoose.model('Book_BookClub', bookSchema);

module.exports = book;