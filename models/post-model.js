const mongoose = require("mongoose")
const user = require("./user-model")

const postSchema = mongoose.Schema({
   user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
   },
   
   content:String,
   likes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
   }]
  
})

module.exports = mongoose.model("post",postSchema)