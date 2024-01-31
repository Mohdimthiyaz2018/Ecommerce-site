const Product = require("../Models/productModel");
const errorHandler = require("../Utils/errorHandler");
const catchAsyncError = require("../MiddleWares/catchAsyncError");

//Get all products - /api/v1/product/getAllProducts
exports.getProducts = async (req, res, next) => {

  let query3 = req.query.page //page 

  let currentPage = Number(query3);
  let resPerPage = 3;
  let skip = (currentPage - 1) * resPerPage;

  const products = await Product.find().limit(resPerPage).skip(skip);
  res.status(200).json({
    success: true,
    message: "Showing all products",
    data: products,
  });
};

//Create new product - /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;
  req.body.user = id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

//Get single product - /api/v1/product/:id
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id).then((data) => {
    if (!data) {
      return next(new errorHandler("Product not found!", 400));
    } else {
      res.status(201).json({
        success: true,
        message: "Product found!",
        data: data,
      });
    }
  });
});

//Update product - /api/v1/product/update/:id
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let success = 0;
  const product = await Product.findById(req.params.id).then((data) => {
    if (!data) {
      return next(new errorHandler("Product not found!", 400));
    } else {
      success = 1;
    }
  });

  if (success == 1) {
    let product1 = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product1,
    });
  }
});

//Delete a product - /api/v1/product/delete/:id
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product1;
  let success = 0;
  await Product.findById(req.params.id).then((data) => {
    if (!data) {
      return next(new errorHandler("Product not found!", 400));
    } else {
      product1 = data;
      success = 1;
    }
  });

  if (success == 1) {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: false,
      message: `${product1.name} deleted successfully!`,
    });
  }
});

//Product search - /api/v1/productSearch
exports.searchProduct = catchAsyncError(async (req, res, next) => {
  let queryKey = req.query.keyword; //product name
  let query1 = req.query.category; //category
  let query2 = req.query.price; //price
  let query3 = req.query.page //page 

  let currentPage = Number(query3) || 1;
  let resPerPage = 2;
  let skip = (currentPage - 1) * resPerPage;

  if(queryKey || query1 || query2)
  {
    let activated = false; //to check whether the price condition is actiavted
    if(query2)
    {
      
      activated = true;
      let query = JSON.stringify(req.query);
      query  = query.replace(/\b(gt|lt|gte|lte)/g, match => `$${match}`);
      query = JSON.parse(query);
      if(queryKey)
      {
        let search = {
          name: {
            $regex: queryKey,
            $options: 'i'
          }
        };
  
        query.name = search.name;
        const removeFields = ['keyword'];
  
        removeFields.forEach( field => delete query[field] );
      }
  
      await Product.find(query).limit(resPerPage).skip(skip).then( (data)=> {
        if(data && data.length > 0)
        {
          return res.status(200).json({
            success: true,
            message: "Products found!",
            count: data.length,
            data
          })
        }
        else
        {
          return next(new errorHandler("No products found!",400));
        }
      } )
    }

    if(!activated)
    {
      if(queryKey) //product name
      {
        let search = {
          name: {
            $regex: queryKey,
            $options: 'i'
          }
        };
        await Product.find(search).limit(resPerPage).skip(skip).then((data) => {
          if (data && data.length > 0) {
            return res.status(200).json({
              success: true,
              message: "Product found!",
              count: data.length,
              data,
            });
          } else {
            return next(new errorHandler("Product not found!", 400));
          }
        });
      }
  
      if(query1) //category
      {
        let search = {
          category: req.query.category
        }
      
        await Product.find(search).limit(resPerPage).skip(skip).then( (data) => {
          if(data && data.length > 0)
          {
            return res.status(200).json({
              success: true,
              message: "Category found!",
              data
            })
          }
          else
          {
            return next(new errorHandler("Category not Found!",400));
          }
        } )
      }
  
    }

  }

  else
  {
    const products = await Product.find().limit(resPerPage).skip(skip);
    res.status(200).json({
      success: true,
      message: `Showing Page ${currentPage} products`,
      data: products,
    });
  }
  
});

//Product filter - /api/v1/productFilter
exports.productFilter = catchAsyncError( async (req,res, next) => {
  let query = JSON.stringify(req.query);
  query  = query.replace(/\b(gt|lt|gte|lte)/g, match => `$${match}`);
  query = JSON.parse(query);
  console.log(query);

  await Product.find(query).then( (data)=> {
    if(data && data.length > 0)
    {
      return res.status(200).json({
        success: true,
        message: "Products found!",
        count: data.length,
        data
      })
    }
    else
    {
      return next(new errorHandler("No products found!",400));
    }
  } )
})

//Product category search - /api/v1/categorySearch
exports.categorySearch = catchAsyncError( async (req,res ,next) => {
  let search = {
    category: req.query.category
  }

  await Product.find(search).then( (data) => {
    if(data && data.length > 0)
    {
      return res.status(200).json({
        success: true,
        message: "Category found!",
        data
      })
    }
    else
    {
      return next(new errorHandler("Category not Found!",400));
    }
  } )
})

// api/v1/product/newReview
exports.createReview = catchAsyncError( async (req,res, next) => {
  const {productId,rating,comment} = req.body;
  const review = {
    user: req.user.id,
    rating,
    comment
  }

  let product = await Product.findById(productId);

  const isReviewed = product.reviews.find( review => {
    return review.user.toString() == req.user.id.toString();
  })

  if(isReviewed)
  {
    return next(new errorHandler("Review already submitted!",401));
  }
  else
  {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
    let totalRatings = 0;

    product.reviews.forEach(review => {
      totalRatings = Number(totalRatings) + Number(review.rating);
    });
    console.log(totalRatings);
    product.ratings = totalRatings/product.reviews.length;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
      success: true,
      message: "Review submitted successfully"
    });
  }
} )

// api/v1/product/getReviews
exports.getReviews = catchAsyncError( async (req,res, next) => {
  const product = await Product.findById(req.params.id);
  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
} )
