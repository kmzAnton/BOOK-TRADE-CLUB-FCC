var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, function(err){
  if(err) throw err;
  // console.log('logged successfuly');
});

module.exports = mongoose.connection;