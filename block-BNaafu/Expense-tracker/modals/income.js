var mongoose = require('mongoose');
var schema = mongoose.Schema;

var incomeSchema =new schema({
source : {type : String , required : true} ,
amount :{type : Number ,required : true} ,
date :{type : Date},
userID :{type : schema.Types.ObjectId ,ref :"User"}

},{timestamps : true})

var Income =mongoose.model("Income" ,incomeSchema)
module.exports = Income;