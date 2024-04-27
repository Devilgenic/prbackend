const User= require("../models/User");
const OTP = require("../models/OTP");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const otpGenerator = require("otp-generator");

//send otp
exports.sendOTP= async(req,res) => {
  try{
  const {email} = req.body;
   const checkUserPresent = await User.findOne({email});
   if(checkUserPresent ){
    return res.status(401).json({
      success: false,
      message: 'User already registered',
    })
   }
   //otp generator
   var otp = otpGenerator.generate(6,{
    upperCaseAlphabets:false,
    lowerCaseAlphabets:false,
    specialChars: false,
   });

   console.log("otp generated", otp);

   let result= await OTP.findOne({otp:otp});

   while(result){
    otp = otpGenerator(6,{
      upperCaseAlphabets:false,
      lowerCaseAlphabets:false,
      specialChars: false,
     });
     result= await OTP.findOne({otp:otp});
   }

   const otpPayload= {email,otp};

   const otpBody= await OTP.create(otpPayload);
   console.log(otpBody);


   res.status(200).json({
     success:true,
     message:"OTP sent successfully",
     otp,
   })


  }

  catch(error){
     console.log(error);
     return res.status(500).json({
      success:false,
      message: error.message,
     })
  }
}


//signUP

exports.signUp= async(req,res)=>{
  try{
  const{
    firstName,
    lastName,
    email,
    password,
    confirmpassword,
    accountType,
    conatctNumber,
    otp

  }= req.body;

  if(!firstName|| !lastName|| !email || !password || !confirmpassword || !otp){
    return res.status(403).json({
      success: false,
      message : "All Fields are Required",
    })
  }

  if(password!= confirmpassword){
   return  res.status(400).json({
      success: false,
      message: 'password and confirm password does not match, please try again ',
    });
  }

  const existingUser = await User.findOne({email});
  if(existingUser){
    return res.status(400).json({
      success: false,
      message: 'User is already registered',
    });
  }

  const recentotp= await OTP.find({email}).sort({createdAt:-1}).limit(1);
  console.log(recentotp);

  if(recentotp.length == 0){
    return res.status(400).json({
      success: false,
      message: 'otp not found',
    })
  }else if(otp !== recentotp.otp){
    return res.status(400).json({
      success:false,
      message: "Invalid OTP",
    });
  }

  const hashedPassword = await bcrypt.hash(password,10);

 

  const user = await User.create({
    firstName,
    lastName,
    email,
    conatctNumber,
    password: hashedPassword,
    accountType,
    
    image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,

  })

  return res.status(200).json({
    success:true,
    message:'User is registerd successfully',
    user,
  });

}
catch(error){
  console.log(error);
  return res.status(500).json({
    success:false,
    message: 'User cannot be registerd. Please try again.'
  })


}
}


//login

exports.login = async(req,res) => {
   
     try{
      const {email,password} = req.body;
      if(!email || !password){
        return res.status(403).json({
          success:false,
          message:'All fields are required,please try again.'
        });
      }

      const user= await  User.findOne({email});
      if(!user){
        return res.status(401).json({
          success:false,
          message: "User is not registerd,Please signup first."
        });
      }

      if(await bcrypt.compare(password,user.password)){

        const payload={
          email: user.email,
          id: user._id,
          role: user.accountType,

        }
        const token = jwt.sign(payload, process.env.JWT_SECRET,{
          expiresIn: "2h",
        });
        user.token= token;
        user.password= undefined;

        const options= {
          expires: new Date(Date.now()+3*24*60*60*1000 ),
          httpOnly:true,
        }

        res.cookie("cookie",cookie,options).status(200).json({
          success:true,
          token,
          user,
          message:"Log in successfully",
        })
      }
      else{
        return res.status(401).json({
          success: false,
          message: 'password is incoorect',
        });
      }

      

     }
     catch(error){
         console.log(error);
         return res.status(500).json({
          success:false,
          message:'LogIN failure, Please try again.'
         })
     }
};


//change password

exports.changepassword= (req,res) => {
  
}
