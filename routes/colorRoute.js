const express = require("express");
const router = express.Router();
const { 
    createColor,
    updateColor,
    deleteColor,
    getColor,
    getAllColor
} = require("../controller/colorCtrl");
const {authMiddleware,isAdminMiddleware} = require("../middlewares/authMiddleware");

router.post('/',authMiddleware,isAdminMiddleware,createColor);
router.put('/:id',authMiddleware,isAdminMiddleware,updateColor);
router.delete('/:id',authMiddleware,isAdminMiddleware,deleteColor);
router.get('/:id',getColor);
router.get('/',getAllColor);


module.exports = router;