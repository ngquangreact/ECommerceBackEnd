const express = require("express");

const {
  createProductCtrl,
  getProductCtrl,
  getAllProductCtrl,
  updateProductCtrl,
  deleteProductCtrl,
  addToWishList,
  rating,
} = require("../controller/productCtrl");
const {
  isAdminMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdminMiddleware, createProductCtrl);

router.get("/", getAllProductCtrl);
router.get("/:id", getProductCtrl);

router.put("/wishlist", authMiddleware, addToWishList);
router.put("/rating", authMiddleware, rating);
router.put("/:id", authMiddleware, isAdminMiddleware, updateProductCtrl);

router.delete("/:id", authMiddleware, isAdminMiddleware, deleteProductCtrl);

module.exports = router;
