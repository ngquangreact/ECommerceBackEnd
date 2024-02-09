const Category = require("../models/blogcategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createCategory = asyncHandler(async(req,res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error)
    }
});

const updateCategory = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const newCategory = await Category.findByIdAndUpdate({_id: id},req.body,{new: true});
        res.json(newCategory);
    } catch (error) {
        throw new Error(error)
    }
});

const deleteCategory = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const deleteCategory = await Category.findByIdAndDelete({_id: id});
        res.json(deleteCategory);
    } catch (error) {
        throw new Error(error)
    }
});

const getCategory = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const getCategory = await Category.findById({_id: id});
        res.json(getCategory);
    } catch (error) {
        throw new Error(error)
    }
});

const getAllCategory = asyncHandler(async(req,res) => {
    try {
        const getAllCategory = await Category.find();
        res.json(getAllCategory);
    } catch (error) {
        throw new Error(error)
    }
});
module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategory
}