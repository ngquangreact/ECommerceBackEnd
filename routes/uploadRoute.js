const express = require("express");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");
const {
  isAdminMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware");
const {
  uploadPhoto,
  productImgResize,
} = require("../middlewares/uploadImages");
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  isAdminMiddleware,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

router.delete(
  "/delete-img/:id",
  authMiddleware,
  isAdminMiddleware,
  deleteImages
);

module.exports = router;
