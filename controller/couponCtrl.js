const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async(req,res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error)
    }
});

const updateCoupon = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const newCoupon = await Coupon.findByIdAndUpdate({_id: id},req.body,{new: true});
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error)
    }
});

const deleteCoupon = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete({_id: id});
        res.json(deleteCoupon);
    } catch (error) {
        throw new Error(error)
    }
});

const getCoupon = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const getCoupon = await Coupon.findById({_id: id});
        res.json(getCoupon);
    } catch (error) {
        throw new Error(error)
    }
});

const getAllCoupon = asyncHandler(async(req,res) => {
    try {
        const getAllCoupon = await Coupon.find();
        res.json(getAllCoupon);
    } catch (error) {
        throw new Error(error)
    }
});

module.exports = {
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getCoupon,
    getAllCoupon
};