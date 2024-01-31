const errorHandler = require('../Utils/errorHandler');
const catchAsyncError = require('../MiddleWares/catchAsyncError');

module.exports = catchAsyncError ( (req,res, next) => {
    const { role } = req.user;

    if(role != 'admin')
    {
        return next( new errorHandler("Not authorized!",401));
    }

    next();
} )