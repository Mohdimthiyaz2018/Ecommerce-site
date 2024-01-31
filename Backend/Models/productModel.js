const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name required!"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 100 characters!"],
  },
  price: {
    type: Number,
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Product description required!"],
  },
  ratings: {
    type: String,
    default: 0.0,
  },
  images: [
    {
      image: {
        type: String,
        required: [true, "Image fileName required!"],
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Product category required!"],
    enum: {
      values: [
        "Electronics",
        "Mobile Phones",
        "Laptops",
        "Accessories",
        "HeadPhones",
        "Food",
        "Book",
        "Cloths",
        "Shoes",
        "Beauty/Health",
        "Sports",
        "Outdoor",
        "Home Appliances",
      ],
      message: "Please select correct category!",
    },
  },
  seller: {
    type: String,
    required: [true, "Product seller required!"],
  },
  stock: {
    type: Number,
    required: [true, "Product stock required!"],
    maxLength: [20, "Product stock cannot exceed 20!"],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Reviwer name required!"],
      },
      rating: {
        type: String,
        required: [true, "Prodcut rating required!"],
      },
      comment: {
        type: String,
        required: [true, "Product comment required!"],
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

let productModel = mongoose.model("product", productSchema);

module.exports = productModel;
