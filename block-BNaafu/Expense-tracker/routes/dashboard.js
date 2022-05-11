var express = require("express");
var router = express.Router();
var Expense = require("../modals/expense");
var Income = require("../modals/income");
var auth = require("../middlewares/auth");
router.get("/", auth.isUser, (req, res, next) => {
  let date = new Date();
  var month = getMonth();
  var year = date.getFullYear();
  let startdate = `${year}/${month}/01`;
  let enddate = `${year}/${month}/30`;
  Income.find(
    { date: { $gte: startdate, $lt: enddate }, userID: req.user.id },
    (err, income) => {
      if (err) return next(err);
      var totalIncome = income.reduce((acc, cv) => {
        acc = cv.amount + acc;
        return acc;
      }, 0);

      Expense.find(
        { date: { $gte: startdate, $lt: enddate }, userID: req.user.id },
        (err, expense) => {
          var totalexpense = expense.reduce((acc, cv) => {
            acc = cv.amount + acc;
            return acc;
          }, 0);

          var bal = totalIncome - totalexpense;
          //res.render('dashboard',{bal :`${totalIncome}` - `${totalexpense}`})
          res.render("dashboard", {
            bal,
            expense,
            income,
            totalIncome,
            totalexpense,
          });
        }
      );
    }
  );
});

// add income route
router.post("/income", auth.isUser, (req, res, next) => {
  // console.log(req.body)
  //console.log(req.user ,"user data")
  req.body.userID = req.user.id;
  Income.create(req.body, (err, income) => {
    console.log(income);
    res.redirect("/dashboard");
  });
});

// add expense route

router.post("/expense", auth.isUser, (req, res, next) => {
  req.body.userID = req.user.id;
  Expense.create(req.body, (err, addExpense) => {
    res.redirect("/dashboard");
  });
});

// all filters
router.get("/filter", auth.isUser, (req, res) => {
  let from = req.query.from;
  let to = req.query.to;
  console.log(from, "fron");
  let incomesource = req.query.source;
  let categorysource = req.query.category;
  let month = req.query.month;

  console.log(incomesource, "sourc");
  if (from && to) {
    Expense.find(
      { date: { $gte: from, $lt: to }, userID: req.user.id },
      (err, expense) => {
        if (err) return next(err);
        var totalexpense = expense.reduce((acc, cv) => {
          acc = cv.amount + acc;
          return acc;
        }, 0);
        Income.find(
          { date: { $gte: from, $lt: to }, userID: req.user.id },
          (err, income) => {
            var totalIncome = income.reduce((acc, cv) => {
              acc = cv.amount + acc;
              return acc;
            }, 0);

            var bal = totalIncome - totalexpense;
            // console.log(filterexp ,filterinc ,"filter")
            res.render("dashboard", {
              income,
              bal,
              expense,
              totalIncome,
              totalexpense,
            });
          }
        );
      }
    );
  } else if (incomesource) {
    Income.find({ incomesource, userID: req.user.id }, (err, income) => {
      var totalIncome = income.reduce((acc, cv) => {
        acc = cv.amount + acc;
        return acc;
      }, 0);
      console.log(income, "income");
      return res.render(
        "dashboard",
        { income, bal: totalIncome, expense: [{}] },
        totalIncome,
        totalexpense
      );
    });
  } else if (categorysource) {
    Expense.find(
      { category: categorysource, userID: req.user.id },
      (err, expense) => {
        var totalIncome = expense.reduce((acc, cv) => {
          acc = cv.amount + acc;
          return acc;
        }, 0);
        //console.log(income ,"income")
        return res.render(
          "dashboard",
          { expense, bal: totalIncome, income: [{}] },
          totalIncome,
          totalexpense
        );
      }
    );
  } else if (month) {
    let year = req.query.month.split("-")[0];
    let month = req.query.month.split("-")[1];
    let date = year + "-" + month + "-" + "01";

    let firstDay = new Date(
      new Date(date).getFullYear(),
      new Date(date).getMonth(),
      1
    );

    let lastDay = new Date(
      new Date(date).getFullYear(),
      new Date(date).getMonth() + 1
    );
    Income.find(
      { date: { $gte: firstDay, $lt: lastDay }, userID: req.user.id },
      (err, income) => {
        if (err) return next(err);
        var totalIncome = income.reduce((acc, cv) => {
          acc = cv.amount + acc;
          return acc;
        }, 0);

        Expense.find(
          { date: { $gte: firstDay, $lt: lastDay }, userID: req.user.id },
          (err, expense) => {
            var totalexpense = expense.reduce((acc, cv) => {
              acc = cv.amount + acc;
              return acc;
            }, 0);

            var bal = totalIncome - totalexpense;
            //res.render('dashboard',{bal :`${totalIncome}` - `${totalexpense}`})
            res.render("dashboard", { bal, expense, income, expense });
          }
        );
      }
    );
  }
});

function getMonth() {
  let date = new Date();
  let month = date.getMonth() + 1;
  if (month) {
    let str = "" + month;
    if (str.length === 1) {
      month = "0" + month;
    }
  }
  return month;
}

module.exports = router;
