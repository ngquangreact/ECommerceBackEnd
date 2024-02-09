const express = require("express");

const {
  createUserCtrl,
  loginUserCtrl,
  getAllUserCtrl,
  getUserCtrl,
  deleteUserCtrl,
  updateUserCtrl,
  blockUserCtrl,
  unBlockUserCtrl,
  handleRefreshTokenCtrl,
  handleLogoutCtrl,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdminCtrl,
  getWishListCtrl,
  saveAddressCtrl,
  userCartCtrl,
  getUserCartCtrl,
  emptyCartCtrl,
  applyCouponCtrl,
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrder,
} = require("../controller/userCtrl");

const {
  authMiddleware,
  isAdminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", createUserCtrl);
router.post("/login", loginUserCtrl);
router.post("/login-admin", loginAdminCtrl);
router.post("/cart", authMiddleware, userCartCtrl);
router.post("/forgot-password-token", forgotPasswordToken);
router.post("/cart/apply-coupon", authMiddleware, applyCouponCtrl);
router.post("/cart/cash-order", authMiddleware, createOrder);

router.get("/users", getAllUserCtrl);
router.get("/refresh", handleRefreshTokenCtrl);
router.get("/logout", handleLogoutCtrl);
router.get("/wishlist", authMiddleware, getWishListCtrl);
router.get("/cart", authMiddleware, getUserCartCtrl);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/get-all-order", authMiddleware, getAllOrder);

router.get("/:id", authMiddleware, isAdminMiddleware, getUserCtrl);

router.put("/edit-user", authMiddleware, updateUserCtrl);
router.put("/save-address", authMiddleware, saveAddressCtrl);
router.put("/password", authMiddleware, updatePassword);
router.put("/reset-password/:token", resetPassword);
router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAdminMiddleware,
  updateOrderStatus
);
router.put("/block-user/:id", authMiddleware, isAdminMiddleware, blockUserCtrl);
router.put(
  "/unblock-user/:id",
  authMiddleware,
  isAdminMiddleware,
  unBlockUserCtrl
);

router.delete("/empty-cart", authMiddleware, emptyCartCtrl);
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteUserCtrl);

module.exports = router;
