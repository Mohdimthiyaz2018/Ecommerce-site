const express = require("express");
const { newOrder, getSingleOrder, myOrders, allOrders, updateOrder, deleteOrder } = require("../Controllers/orderControllers");
const isAuthenticated = require("../MiddleWares/isAuthenticated");
const isAuthorized = require('../MiddleWares/isAuthorized');
const router = express.Router();

router.route("/order/newOrder").post(isAuthenticated, newOrder);
router.route("/order/getSingleOrder/:id").get(isAuthenticated, getSingleOrder);
router.route("/order/myOrders").get(isAuthenticated, myOrders);

// ************************Admin***************************************
router.route("/order/allOrders").get(isAuthenticated, isAuthorized ,allOrders);
router.route("/order/updateOrder/:id").get(isAuthenticated, isAuthorized ,updateOrder);
router.route("/order/deleteOrder/:id").delete(isAuthenticated, isAuthorized ,deleteOrder);
module.exports = router;
