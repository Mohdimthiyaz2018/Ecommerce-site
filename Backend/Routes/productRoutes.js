const express = require("express");
const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
  categorySearch,
  productFilter,
  createReview,
  getReviews,
} = require("../Controllers/productControllers");
const isAuthenticated = require('../MiddleWares/isAuthenticated');
const isAuthorized = require('../MiddleWares/isAuthorized');
const router = express.Router();

router.route("/product/getAllProducts").get(getProducts);
router.route("/product/new").post(isAuthenticated,isAuthorized,newProduct);
router.route("/product/:id").get(isAuthenticated,getSingleProduct);
router.route("/product/update/:id").put(isAuthenticated,isAuthorized,updateProduct);
router.route("/product/delete/:id").delete(isAuthenticated,isAuthorized,deleteProduct);
router.route("/productSearch").get(isAuthenticated,searchProduct);
router.route("/categorySearch").get(isAuthenticated,categorySearch);
router.route("/productFilter").get(isAuthenticated,productFilter);
router.route('/product/newReview').post(isAuthenticated, createReview);
router.route('/product/getReviews/:id').get(isAuthenticated, getReviews);

module.exports = router;
