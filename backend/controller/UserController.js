const User = require("../models/UserModel");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken.js");
const sendMail = require("../utils/sendMail.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

exports.createUser = catchAsyncErrors(async (req, res, next) => {

  try {
    const { name, email, password, avatar } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    if(req.body.password.length < 8){
      return next(
        res.status(400).json({
          message:"Password length must to 8 characters"
        })
        );

    }
    if(avatar=='/profile.png'){
      return next(
        res.status(400).json({
          message:"Please  upload profile picture"
        })
        );

    }
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
    });

    user = await User.create({
      name,
      email,
      password,
      avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
    });
    
    sendToken(user, 201, res);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error,
    });
  }
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if(!email || !password){
    return next(
      res.status(400).json({
       message: "Please enter the email & password"   })
      );

  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      res.status(400).json({
       message: "User is not find with this email & password"   })
      );
  
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(
      res.status(400).json({
       message: "Incorrect password"   })
      );

  }

  sendToken(user, 201, res);
});

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Log out success",
  });
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }


  const resetToken = user.getResetToken();

  await user.save({
    validateBeforeSave: false,
  });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl}`;

  try {
    await sendMail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} succesfully`,
    });
   } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;
    console.log(error)

    await user.save({
      validateBeforeSave: false,
    });

    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTime: { $gt: Date.now() },
  });

  if (!user) {
    
    res.status(400).json({
      success: true,
      message: `Reset password url is invalid or has been expired`,
    });

  }

  if (req.body.password !== req.body.confirmPassword) {
    res.status(400).json({
      success: true,
      message: `Password is not matched with the new password`,
    });
   
  }
  if (req.body.password.length < 8 ) {
    res.status(400).json({
      success: true,
      message: `Password must be 8 characters`,
    });
   
  }
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordTime = undefined;

  await user.save();

  sendToken(user, 200, res);
});

exports.userDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
   
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
      return next(
        res.status(400).json({
          message:"Old Password incorrect"
        })
      );
    };

    if(req.body.newPassword  !== req.body.confirmPassword){
        return next(
          res.status(400).json({
            message:"Password not matched with each other"
          })
          );
    }
    if(req.body.newPassword.length < 8){
      return next(
        res.status(400).json({
          message:"Password length must to 8 characters"
        })
        );

    }
    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);
});

exports.updateProfile = catchAsyncErrors(async(req,res,next) =>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

   if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidator: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

exports.getAllUsers = catchAsyncErrors(async (req,res,next) =>{
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

exports.getSingleUser = catchAsyncErrors(async (req,res,next) =>{
    const user = await User.findById(req.params.id);
   
    if(!user){
        return next(new ErrorHandler("User is not found with this id",400));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

exports.updateUserRole = catchAsyncErrors(async(req,res,next) =>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
    const user = await User.findByIdAndUpdate(req.params.id,newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user
    })
});

exports.deleteUser = catchAsyncErrors(async(req,res,next) =>{
  
   const user = await User.findById(req.params.id);

   const imageId = user.avatar.public_id;

   await cloudinary.v2.uploader.destroy(imageId);

    if(!user){
        return next(new ErrorHandler("User is not found with this id",400));
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message:"User deleted successfully"
    })
});
