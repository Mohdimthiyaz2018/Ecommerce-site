const catchAsyncError = require('../MiddleWares/catchAsyncError');
const Order = require('../Models/orderModel');
const Product = require('../Models/productModel');
const errorHandler = require('../Utils/errorHandler');

// api/v1/order/newOrder
exports.newOrder =  catchAsyncError( async (req, res, next) => {
    let {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    let quantity = 0;
    let price = 0;
    let totalAmount = 0;

    orderItems.forEach(order => {
        quantity = order.quantity;
        price = order.price;
        totalAmount = totalAmount + (quantity * price);
    })

    totalPrice = taxPrice + shippingPrice + totalAmount;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    })

    res.status(200).json({
        success: true,
        order
    })
});

// api/v1/order/getSingleOrder
exports.getSingleOrder = catchAsyncError( async (req,res, next) => {
    const order = await Order.findById(req.params.id).populate('user','name email');
    if(!order)
    {
        return next(new errorHandler("Order not found with this id",404));
    }

    res.status(200).json({
        success: true,
        message: "Order found!",
        order
    })
} );

// api/v1/order/myOrders
exports.myOrders = catchAsyncError( async (req,res, next) => {
    const orders = await Order.find({user: req.user.id});
    res.status(200).json({
        success: true,
        orders
    })
} );

//Admin: api/v1/order/allOrders
exports.allOrders = catchAsyncError( async (req,res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    });

    res.status(200).json({
        success: true,
        orders,
        totalAmount
    })
} );

async function updateStock(productId,quantity)
{
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    await product.save({validateBeforeSave: false});
}

//Admin: api/v1/order/updateOrder/:id
exports.updateOrder = catchAsyncError( async (req,res, next) => {
    const order = await Order.findById(req.params.id);

    if(order.orderStatus == 'Delivered')
    {
        return next(new errorHandler("Order has been already delivered!",401));
    }

    order.orderItems.forEach(async order => {
        await updateStock(order.product,order.quantity);
    });
    order.orderStatus = req.body.status;
    await order.save();

    res.status(200).json({
        success: true,
        message: "Order status updated successfully"
    })
    
} );

//Admin: api/v1/order/deleteOrder/:id
exports.deleteOrder = catchAsyncError( async (req,res, next) => {
    const order = await Order.findById(req.params.id);
    if(!order)
    {
        return next(new errorHandler("Order not found with this id",401));
    }
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    })
} )