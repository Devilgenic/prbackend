const mongoose= require("mongoose");

const otpSchema= new mongoose.Schema({

  emial:{
    type:String,
    required:true,
  },
  otp:{
    type:String,
    required:true,
  },
  createdAt:{
    type:Date,
    default: Date.now(),
    expires: 5*60,
  }

})


//function to send mail

async function sendVerificationEmail(email,otp){
  try{

    const mailResponse= await mailSender(email,"Verification email from AITPRCELL", otp);
    console.log("Email Sent Sucsssesfully: ", mailResponse); 
  }
  catch(error){
    console.log("error occured while sending mails:",error);
    throw error;
  }

}

otpSchema.pre("save", async function(next){
  await sendVerificationEmail(this.email,this.otp);
  next();
})

module.exports= mongoose.model("OTP",otpSchema);