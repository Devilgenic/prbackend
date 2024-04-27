const jwt = require("jsonwebtoken");
require("dotenv").config();
const user= require("../models/User");


//auth

exports.auth = async(req,res,next) => {
  try{
    const token = req.body.token || req.cookies.token || req.header("Authorisation").replace("Bearer ", "");

    if(!token){
      return res.status(401).json({
        success: false,
        message: 'token not found',
      });
    }

    try{
      const decode=  jwt.verify(token,process.env.JWT_SECRET);
      console.log(decode);
      req.user=decode;
    }
    catch(error){
        return res.status(401).json({
          success: false,
          message: 'token is invalid',
        })
    }

    next();
  }
  catch(error){

    return res.status(401).json({
      success:false,
      message:'something went wrong while validating token',
    });

  }
}


//isStudent

exports.isStudent= async(req,res,next) => {
  try{

    if(req.user.accountType !== "Student"){
      return res.status(401).json({
        success: false,
        message: 'This is protected route for Students only',
      });
    }
    next();

  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      success: false,
      message:'User role cannot be verified, plase try again',
    })
  }
}


//isAdmin

exports.isAdmin= async(req,res,next) => {
  try{

    if(req.user.accountType !== "Admin"){
      return res.status(401).json({
        success: false,
        message: 'This is protected route for Admin only',
      });
    }
    next();

  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      success: false,
      message:'User role cannot be verified, plase try again',
    })
  }
}

