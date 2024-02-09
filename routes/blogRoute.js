const express = require("express");
const router = express.Router();

const {
  createBlogCtrl,
  updateBlogCtrl,
  getBlogCtrl,
  deleteBlogCtrl,
  getAllBlogCtrl,
  likeBlog,
  dislikeBlog,
  uploadImages,
} = require("../controller/blogCtrl");
const {
  authMiddleware,
  isAdminMiddleware,
} = require("../middlewares/authMiddleware");
// const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImages");

router.post("/", authMiddleware, isAdminMiddleware, createBlogCtrl);
// router.put(
//   "/upload-images/:id",
//   authMiddleware,
//   isAdminMiddleware,
//   uploadPhoto.array("images", 2),
//   blogImgResize,
//   uploadImages
// );
router.put("/like", authMiddleware, likeBlog);
router.put("/dislike", authMiddleware, dislikeBlog);
router.put("/:id", authMiddleware, isAdminMiddleware, updateBlogCtrl);
router.get("/:id", getBlogCtrl);
router.get("/", getAllBlogCtrl);
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteBlogCtrl);

module.exports = router;
