const express = require("express");
const router = express.Router();
const { 
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getAllBrand
} = require("../controller/brandCtrl");
const {authMiddleware,isAdminMiddleware} = require("../middlewares/authMiddleware");

router.post('/',authMiddleware,isAdminMiddleware,createBrand);
router.put('/:id',authMiddleware,isAdminMiddleware,updateBrand);
router.delete('/:id',authMiddleware,isAdminMiddleware,deleteBrand);
router.get('/:id',getBrand);
router.get('/',getAllBrand);


module.exports = router;