var passport = require('passport');
const { isAdmin } = require('../middlewares/auth');
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../modals/user')

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile)
     
      var profileData = {
          name :profile.username,
         password : profile.username ,
        email :profile._json.blog,
        photo :profile._json.avatar_url,
        isAdmin : false,
        
      }
    User.findOne({email:profile._json.blog},(err,user) => {
        console.log(user ,"github user")
        if(err) return done(err);
        if(!user) {
            User.create(profileData ,(err ,addedUser) => {
                if(err) return done(err);
                return done(null ,addedUser) 
            })
        } else {
          done(null ,user)
        }
        
    })
  }
));



//google auth
passport.use(new GoogleStrategy({
    clientID: process.env.CLINTID,
    clientSecret: process.env.CLINTSECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      //console.log(profile , 'google data')
      var profileData = {
        name:profile._json.given_name,
       password : profile._json.family_name,
      email :profile._json.email,
      photo :profile._json.picture ,
      isAdmin : false,
      
    }

    User.findOne({email:profile._json.email},(err,user) => {
       console.log(user,"google user")
        if(err) return done(err);
        if(!user) {
            User.create(profileData ,(err ,addedUser) => {
                if(err) return done(err);
                return done(null ,addedUser) 
            })
        } else {
          done(null ,user)
        }
        
    })

  }
));

passport.serializeUser((user ,done) => {
    done(null ,user.id)
})

passport.deserializeUser(function (id,done) {
    User.findById(id, "name email isAdmin ",function (err,user){
       done(err ,user)
    })
})

