const catchAsyncError = require('./catchAsyncError');
const errorHandler = require('../Utils/errorHandler');
const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');

module.exports = catchAsyncError( async (req,res, next) => {
    const { token } = req.cookies;

    if(!token)
    {
        return next(new errorHandler("Login first to access this resource!",401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    next(); //to call the next middleware

} )