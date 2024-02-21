const express = require("express");
const  router = express.Router();
const { 
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getCoupon,
    getAllCoupon
} = require("../controller/couponCtrl");
const {authMiddleware,isAdminMiddleware} = require("../middlewares/authMiddleware");

router.post('/',authMiddleware,isAdminMiddleware,createCoupon);
router.put('/:id',authMiddleware,isAdminMiddleware,updateCoupon);
router.delete('/:id',authMiddleware,isAdminMiddleware,deleteCoupon);
router.get('/:id',getCoupon);
router.get('/',getAllCoupon);

module.exports = router;