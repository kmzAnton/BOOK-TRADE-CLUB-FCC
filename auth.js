var passport = require('passport'),
    bcrypt = require("bcrypt"),
    LocalStrategy = require('passport-local').Strategy,
    userModel = require('./schema/user_BookClub.js'),
    db = require('./db.js');


passport.use('local_login', new LocalStrategy(
  function(username, password, done){
    userModel.findOne({username:username.trim()})
        .then(resp=>{
          // console.log(resp);
          if(!resp){
            console.log('onLogging: Username is not found');
            return done(null, false);
          }else{
            bcrypt.compare(password, resp.password, function(err, ans){
              if(err){
                console.log(err);
                return done(null, false);
              }else{
                console.log(ans);
                if(!ans){
                  console.log('onLogging: Password is not correct');
                  return(null, false);
                }else{
                  console.log('onLogging: User '+username+' has just logged in');
                  
                  var data = {};

                  data.id=resp._id;
                  data.username= resp.username;
                  if(resp.email)data.email=resp.email;
                  if(resp.city)data.city=resp.city;
                  if(resp.region)data.region= resp.region;
                  if(resp.country)data.country= resp.country;
                  
                  return done(null, data);
                }
              }
            });
          }  
        }).catch(e=>{console.log(e); return done(null, false)});
  }
));

passport.use('local_signup', new LocalStrategy({passReqToCallback: true},
  function(req, username, password, done){
    if(!username || !password){
      console.log('onSignup: username or password is incorrect');
      return done(null, false);
    }else{
      bcrypt.hash(password, 10, function(err, hash){
        if(err){
          console.log(err);
          return done(null, false);
        }else{
          
          var newUser = new userModel({
            username:username,
            password:hash,
            email:req.body.email,  
          });
          
          console.log(newUser);
          
          newUser.save(function(err){
            if(err){
              console.log(err);
              return done(null, false);
            }else{
              console.log('onSignup: User is successfuly registered');
              userModel.findOne({username:username})
                .then(function(resp){
                  console.log();
                  if(!resp){
                    console.log('onSignup: Strange... recently registred user is not in dbase!!!');
                    return done(null, false);
                  }else{
                    console.log('onSignup: Good... recently registred user has just logged in!!!');
                    return done(null, resp);
                  }
                }).catch(e=>{
                  console.log(e);
                  return done(null, false);
                });
            }
          });
          
        }
      });
    }
  }
));

passport.serializeUser(function(data, done){
  done(null, data);
});

passport.deserializeUser(function(data, done){
  done(null, data);
});

module.exports = passport;