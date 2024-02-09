const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createBrand = asyncHandler(async(req,res) => {
    try {
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    } catch (error) {
        throw new Error(error)
    }
});

const updateBrand = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const newBrand = await Brand.findByIdAndUpdate({_id: id},req.body,{new: true});
        res.json(newBrand);
    } catch (error) {
        throw new Error(error)
    }
});

const deleteBrand = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const deleteBrand = await Brand.findByIdAndDelete({_id: id});
        res.json(deleteBrand);
    } catch (error) {
        throw new Error(error)
    }
});

const getBrand = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const getBrand = await Brand.findById({_id: id});
        res.json(getBrand);
    } catch (error) {
        throw new Error(error)
    }
});

const getAllBrand = asyncHandler(async(req,res) => {
    try {
        const getAllBrand = await Brand.find();
        res.json(getAllBrand);
    } catch (error) {
        throw new Error(error)
    }
});
module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getAllBrand
}