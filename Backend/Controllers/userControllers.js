const catchAsyncError = require("../MiddleWares/catchAsyncError");
const User = require("../Models/userModel");
const sendEmail = require("../Utils/email");
const errorHandler = require("../Utils/errorHandler");
const crypto = require("crypto");

// /api/v1/user/registerUser
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const {email} = req.body;
  const userChecker = await User.findOne({email});
  if(userChecker)
  {
      return res.status(401).json({
      success: false,
      message: "Email already registered!"
    })
  }

  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    message: "User created successfully!",
    user,
  });
});

// api/v1/user/loginUser
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new errorHandler("invalid credentials", 401));
  }

  if (!(await user.isValidPassword(password))) {
    //checking password is correct
    return next(new errorHandler("invalid password", 401));
  }

  const token = user.generateJsonWebToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(201).cookie("token", token, options).json({
    success: true,
    message: "Login successfull",
    user,
    token,
  });
});

// api/v1/user/logoutUser
exports.logOutUser = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged out successfully!",
    });
});

// api/v1/user/forgotPassword
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const token = await user.resetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/reset/${token}`;
    const message = `Your password reset url is as follows \n \n 
    ${resetUrl}`;

    try {
      sendEmail({
        email: user.email,
        subject: "Reset password link",
        message: message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
        resetUrl,
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new errorHandler(err.message, 401));
    }
  } else {
    return next(new errorHandler("Mail not found", 500));
  }
});

// api/v1/user/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const token = req.params.token;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpire: {
      $gt: Date.now()
    }
  });

  if (!user) {
    return next(
      new errorHandler("Password reset token is invalid or expired!", 401)
    );
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(new errorHandler("Password does not match!", 401));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Password changed suucessfully, Please login again",
  });
});

// api/v1/user/userProfile
exports.getUserProfile = catchAsyncError( async (req,res, next) => {
  const id = req.user.id;
  const user = await User.findById(id);
  res.status(200).json({
    success: true,
    user
  })
} );

// api/v1/user/changePassword
exports.changePassword = catchAsyncError( async (req,res, next) => {
  const id = req.user.id;
  const user = await User.findById(id).select('+password');
  if(!await user.isValidPassword(req.body.oldPassword))
  {
    return next(new errorHandler("oldPassword is incorrect",401));
  }

  user.password = req.body.newPassword;
  await user.save({validateBeforeSave: false});
   res.status(200).json({
    success: true,
    message: "password changed successfully"
   })
} );

// api/v1/user/updateProfile
exports.updateProfile = catchAsyncError( async (req,res, next) => {
  const newUserData = {
    email: req.body.email,
    name: req.body.name
  };

  const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user
  })
} )

// ***********************ADMIN***********************

// api/v1/admin/getAllUsers
exports.getAllUsers = catchAsyncError( async (req,res, next) => {
  const user = await User.find();
   
  res.status(200).json({
    success: true,
    message: "Users found",
    user
  })
} );

// api/v1/admin/getSpecificUser
exports.getSpecificUser = catchAsyncError( async (req,res, next) => {
  const id  = req.params.id;
  const user = await User.findById(id);
  if(!user)
  {
    return next(new errorHandler("User not found",404));
  }

  res.status(200).json({
    success: true,
    message: "User found successfully",
    user
  })
} );

// api/v1/admin/updateUser
exports.updateUser =  catchAsyncError( async (req,res, next) => {
  const newUserData = {
    email: req.body.email,
    name: req.body.name,
    role: req.body.role
  };

  const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user
  })
} );

// api/v1/admin/deleteUser
exports.deleteUser = catchAsyncError( async (req,res, next) => {
  const id  = req.params.id;
  const user = await User.findById(id);
  if(!user)
  {
    return next(new errorHandler("User not found",404));
  }
  const name = user.name;
  await user.deleteOne({id});

  res.status(200).json({
    success: true,
    message: `User(${name}) deleted successfully`
  })
} )