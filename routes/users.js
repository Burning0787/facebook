const mongoose = require("mongoose");
const passportMongoose = require("passport-local-mongoose");

mongoose.connect('mongodb://localhost/facebook')
.then(function(){
console.log('Database Connected')
})
.catch(function(err){
console.log(e)
})
const userSchema = mongoose.Schema({
  username : String,
  name : String,
  email : String,
 password : String
});

userSchema.plugin(passportMongoose);

module.exports=mongoose.model("user",userSchema);