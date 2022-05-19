var User =require('../modals/user')
var Expense = require('../modals/expense')
var Income = require('../modals/income')
module.exports = {
    loggedInUser: (req, res, next) => {
        if (req.session && req.session.userID) {
          next();
        } else {
          res.redirect("/users/login");
        }

        if (req.session && req.user.id) {
          next();
        } else {
          res.redirect("/users/login");
        }
      },
      userInfo: (req, res, next) => {

        if(req.user){
          let user = req.user;
          res.locals.user = user;
          return next();
        }
        
        if (! req.user) {
          var userID = req.session && req.session.userID;
          User.findById(userID, "name email isAdmin _id", (err, user) => {
            if (err) return next(err);
            req.user = user;
            res.locals.user = user;
            
            return next();
          });
        } else {
          req.user = null;
          res.locals.user = null;
          next();
        }

        
      },

      isAdmin : (req ,res ,next ) => {
          var isAdmin = req.user.isAdmin;
          if(isAdmin === true){
            
             return next()
          } else {
              res.redirect('/dashboard')
          }
      } 
      ,
      isUser :(req ,res ,next) => {
          var isAdmin = req.user.isAdmin;
          if(isAdmin === false) {

            Income.find(
              {userID: req.user._id},
              (err, income) => {
                if (err) return next(err);
                var totalIncome = income.reduce((acc, cv) => {
                  acc = cv.amount + acc;
                  return acc;
                }, 0);
         
                Expense.find(
                  {userID : req.user._id},
                  (err, expense) => {
                    var totalexpense = expense.reduce((acc, cv) => {
                      acc = cv.amount + acc;
                      return acc;
                    }, 0);
        
                    var bal = totalIncome - totalexpense;
                    res.locals.bal = bal
                    return next()
                  }
                );
              }
            );

             //return next()
          } else {
            res.redirect('/dashboard')
          }
      }
}