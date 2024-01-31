const express = require('express');
const { registerUser, loginUser, logOutUser, forgotPassword, resetPassword, getUserProfile, changePassword, updateProfile, getAllUsers, getSpecificUser, updateUser, deleteUser } = require('../Controllers/userControllers');
const isAuthenticated = require('../MiddleWares/isAuthenticated');
const isAuthorized = require('../MiddleWares/isAuthorized');
const router = express.Router();

router.route('/user/registerUser').post(registerUser);
router.route('/user/loginUser').post(loginUser);
router.route('/user/logoutUser').get(logOutUser);
router.route('/user/forgotPassword').post(forgotPassword);
router.route('/user/reset/:token').post(resetPassword);
router.route('/user/userProfile').get(isAuthenticated ,getUserProfile);
router.route('/user/changePassword').post(isAuthenticated, changePassword);
router.route('/user/updateProfile').put(isAuthenticated,updateProfile);

// *********************Admin********************
router.route('/admin/getAllUsers').get(isAuthenticated, isAuthorized, getAllUsers);
router.route('/admin/getSpecificUser/:id').get(isAuthenticated, isAuthorized, getSpecificUser);
router.route('/admin/updateUser/:id').put(isAuthenticated, isAuthorized, updateUser);
router.route('/admin/deleteUser/:id').post(isAuthenticated, isAuthorized, deleteUser);

module.exports = router;