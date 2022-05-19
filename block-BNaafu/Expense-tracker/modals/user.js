var mongoose = require('mongoose');
var schema = mongoose.Schema;
var bcrypt =require('bcrypt')

var userSchema = new schema({
    name : {type : String, required : true},
    email : {type : String ,unique : true},
    password :{type : String ,minlength : 5 , required : true} ,
    age:{type : Number },
    phone:{type : Number},
    country:{type : String ,default :"India"},
    isAdmin :{
      type : Boolean
    },
    
} ,{timestamps : true})

// bcrypt password
userSchema.pre('save' ,function(next) {
    console.log(this ,'inside pre save')

    // all admin
    let allAdmin =[
       "vikas@gmail.com" 
    ];

    if (allAdmin.includes(this.email)) {
         this.isAdmin = true;
    } else {
        this.isAdmin = false;
    }

    //hasing the password
    if(this.password && this.isModified('password')){
      bcrypt.hash(this.password ,10 ,(err ,hash) =>{
          console.log(hash)
          if(err) return next(err)
          this.password = hash ;
          return next()
      })

    } else {
       next()
    }
})

userSchema.methods.verifyPassword = function(password ,cb) {
    bcrypt.compare(password ,this.password ,(err ,result) => {
      return cb(err ,result)
    })
  }

var User = mongoose.model('User' , userSchema);
module.exports = User;