const express = require("express");
const router = express.Router();
const { 
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategory
} = require("../controller/blogcategoryCtrl");
const {authMiddleware,isAdminMiddleware} = require("../middlewares/authMiddleware");

router.post('/',authMiddleware,isAdminMiddleware,createCategory);
router.put('/:id',authMiddleware,isAdminMiddleware,updateCategory);
router.delete('/:id',authMiddleware,isAdminMiddleware,deleteCategory);
router.get('/:id',getCategory);
router.get('/',getAllCategory);


module.exports = router;