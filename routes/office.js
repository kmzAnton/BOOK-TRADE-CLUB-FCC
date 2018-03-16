var rp = require('request-promise');
var bookModel = require('../schema/book_BookClub.js');
var userModel = require('../schema/user_BookClub.js');
var reqModel = require('../schema/request_BookClub.js');


module.exports = function(){
  var functions = {};
  function Info(){
    this.title = 'Book Club';
    this.error_msg = undefined;
    this.username = undefined;
    this.userId = undefined;
  }
  function Btn_Top(){
    this.login=false;
    this.sigup=false;
    this.logout=false;
  }
  
  
  functions.main = function(req,res){
    var info = new Info();
    
    info.title = 'Home';
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
    
    bookModel.find({addedBy:info.userId}, function(err, resp){
      if(err)throw err;
      
      if(!resp){
        console.log('No such an ID found');
        
        var books = [],
            requests={yours:[],toYou:[]};
        
        res.render('page/home.ejs', {info, books, requests});
      }else{
        console.log('ID found');
        
        var books = resp,
            requests={yours:[],toYou:[]};
        
        reqModel.find({}, function(err,instance){

          instance.forEach(item=>{
            if(item.requester==req.user.id){
              requests.yours.push({bookName: item.bookName, isAccepted: item.isAccepted, reqId: item._id});
            }
            if(item.bookOwner == req.user.id){
              requests.toYou.push({bookName: item.bookName, isAccepted: item.isAccepted, reqId: item._id});
            }
          });
          // console.log(requests);
          res.render('page/home.ejs', {info, books, requests});
        })
        
        
      }     
    });
    
    
  }
  
  
  functions.add_book = function(req,res){
    var info = new Info();
    
    info.title = "Add book";
    if(req.user){
      info.username = req.user.username;
      info.userId = req.user.id;
    }
    else{
      info.username = undefined;
      info.userId = undefined;
    }
    
    
    res.render('page/add_new_book.ejs', {info});
  }
  
  
  functions.add_to_lib = function(req,res){
    
    var volumeId = req.body.id,
        url = 'https://www.googleapis.com/books/v1/volumes/'+volumeId;
    
    rp({uri:url, json:true})
      .then(resp=>{
      
        var newBook = new bookModel ({
          name: resp.volumeInfo.title,
          author: resp.volumeInfo.authors.join(', '),
          short_desc: resp.volumeInfo.description.slice(0,70),
          category: resp.volumeInfo.categories.join(', '),
          image: resp.volumeInfo.imageLinks.thumbnail,
          link: resp.volumeInfo.infoLink,
          volumeId: resp.id,
          addedBy: req.user.id,
          addedOn: (new Date()).getTime(),
          onTrade: false,
        });
        
        newBook.save(function(err){
          if(err){
            console.log(err);
            res.end('Bad');
          }
          else{
            console.log('New book is added')
            res.end('Good');
          }         
        });
        });
    
  }
  
  
  functions.logout = function(req,res){
    req.logOut();
    req.session.destroy(res.redirect('/'));
  }
  
  
  functions.edit_user_info = function(req,res){
    
    var user_info = req.body;

    userModel.findOneAndUpdate({_id:req.user.id},{$set:user_info},{upsert:true, new: true},function(err, resp){
      if(err){
        console.log(err)
        res.end();
      }
      else{
        console.log(resp);
        
        if(resp.username)req.user.username = resp.username;
        if(resp.email)req.user.email = resp.email;
        if(resp.city)req.user.city = resp.city;
        if(resp.region)req.user.region = resp.region;
        if(resp.country)req.user.country = resp.country;
        
        res.end('Good');
      }
    });
    
  }
  
  
  functions.delete_your_request = function(req,res){
    
    var reqId = req.body.reqId;
    
    reqModel.remove({_id: reqId},function(err){
      if(err){
        console.log(err);
        res.end('Bad');
      }
      else{
        console.log('onReqRemove: request was successfuly removed!')
        res.end('Good');
      }
    })
  }
  
  
  functions.accept_request = function(req,res){
    
    var reqId = req.body.reqId;
    
    reqModel.update({_id: reqId},{$set:{isAccepted:true}},function(err){
      if(err){
        console.log(err);
        console.log('onReqUpdate: request is NOT updated');
        res.end('Bad');
      }else{
        console.log('onReqUpdate: request is successufuly updated');
        res.end('Good');
      }
    });
  }
  
  
  return functions;
}