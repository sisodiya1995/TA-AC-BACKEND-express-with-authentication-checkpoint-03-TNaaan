var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Login success');
});

var User = require('../modals/user')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('home page')
  
});


router.get('/register' ,(req ,res ,next) => {
  res.render('register')

})

router.post('/register' ,(req ,res ,next) => {
  //console.log(req.body)
  User.create(req.body ,(err ,user) => {
    console.log(err ,user)
    res.redirect('/users/login')
  })

})
router.get('/login' ,(req ,res ,next) => {
  res.render('login')
  
})

router.post('/login', function(req, res, next) {
  var {email ,password} = req.body;
  if(! email ||! password) {
    // req.flash('error' ,'email/password are required')
   return res.redirect('/users/login')
  }

if(password.length < 4){
 // req.flash('errorPassword' ,'password less than four')
  return res.redirect('/users/login')
}
  User.findOne({email} ,(err ,user) => {
    if(err) return next(err)
      console.log(user, "login user")
    // no user
    if(! user) {
      return res.redirect('/users/login');
    }

    // compare
    user.verifyPassword(password ,(err ,result) => {
      if(err) return next(err);
      console.log(err ,result)
      if(! result) {
       // req.flash('wrongPassword' ,'password is worng')
         return res.redirect('/users/login')
      }

// persist login user info
      req.session.userID = user.id
      if(user.isAdmin === true ) {
       return res.redirect('/users')
      }  
      if(user.isAdmin === false ) {
        return res.redirect('/dashboard')
      } else {
        return res.redirect('/users/login')
      }

    })
  })

});

//logout

router.get('/logout' , (req ,res) => {
  req.session.destroy();
  res.clearCookie('Connect.sid');
  res.redirect('/users/login');

})
module.exports = router;

// SECRET =somerandomsecret
// CLIENT_ID = 4dd31e6d378974f267a3
// CLIENT_SECRET =da509186dd4fd78db0c451064a18abb74c1f491e
// CLINTID=928098088238-seg47lpc5gt1sosfmrgdtck4ap9vp0vm.apps.googleusercontent.com
// CLINTSECRET=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