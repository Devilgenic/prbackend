const mongoose= require("mongoose");

const userschema = new mongoose.Schema({
   firstname:{
      type: String,
      required: true,
      trim: true,
   },
   lastname:{
    type: String,
    required: true,
    trim: true,
 },

   email:{
     type: String,
     required: true,
     trim: true,
   },
   password:{
    type: String,
    required: true,
    
  },
  accountType:{
    type: String,
    required: true,
    enum: ["Admin","Student"],
  },



   image:{
    type: String,
    required: true,
   },

   token:{
    type: String
   },

   resetPasswordExpires:{
     type: Date,
   },

 

   


})

module.exports= mongoose.model("User",userschema);