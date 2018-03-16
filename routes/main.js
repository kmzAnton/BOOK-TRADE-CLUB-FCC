var bookModel = require('../schema/book_BookClub.js');
var reqModel = require('../schema/request_BookClub.js');


module.exports = function(){
  var functions = {};
  function Info(){
    this.title = 'All books';
    this.error_msg = undefined;
    this.username = undefined;
    this.userId = undefined;
  }
  
  functions.all_books = function(req,res){
    var info = new Info();
    
    if(req.user){
      info.username = req.user.username;
      info.userId = req.user.id;
      info.email = req.user.email;
      info.city = req.user.city;
      info.region = req.user.region;
      info.country = req.user.country;
    }else{
      info.username = undefined;
      info.userId = undefined;
      info.email = undefined;
      info.city = undefined;
      info.region = undefined;
      info.country = undefined;
    }
    
    console.log(info);
    
    bookModel.find({},{_id:0})
      .then(function(books){
      
        res.render('page/all_books.ejs', {info, books});
      })
      .catch(e=>console.log(e));
    
  }
  
  
  functions.onTrade = function(req,res){
    
    var trade = req.body.trade;
    var volumeId = req.body.volumeId;
    
    if(trade == 'Trade'){
      bookModel.update({volumeId: volumeId},{$set:{onTrade:true}},function(err){
        if(err){
          console.log(err);
          res.end('Bad. Book onTrade is NOT updated to TRUE');
        }else{
          console.log('Book onTrade is updated');
          res.end('Good');
        }
      });
    }else{
      bookModel.update({volumeId: volumeId},{$set:{onTrade:false}},function(err){
        if(err){
          console.log(err);
          res.end('Bad. Book onTrade is NOT updated');
        }else{
          console.log('Book onTrade is updated tp FALSE');
          res.end('Good');
        }
      });
    }
      
      
  }
  
  
  functions.make_new_request = function(req,res){
    var volumeId = req.body.volumeId;
    // console.log(volumeId);
    
    bookModel.findOne({volumeId: volumeId}, function(err, resp){
      if(err){throw err}
      else{
        if(!resp){
          console.log('onBooksearch: no book found to make a new request');
          res.end('Bad');
        }else{
          console.log('onBooksearch: GOOD.. book found to make a new request');
          
          var newRequest = new reqModel({
            bookId: resp.volumeId,
            bookName:resp.name,
            bookOwner: resp.addedBy,
            requester:req.user.id,
            reqDate: (new Date()).getTime(),
            isAccepted: false
          });
          
          newRequest.save(function(err){
            if(err){
              console.log(err);
              console.log('onReqSave: error thrown, request is not saved');
              res.end('Bad');
            }else{
              console.log('onReqSave: GOOD...new request is saved');
              res.end('Good');
            }
          });
          
        }
      }
    });
    
  }
  
  
  
  return functions;
}