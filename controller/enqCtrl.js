const Enquiry = require("../models/enqModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createEnquiry = asyncHandler(async(req,res) => {
    try {
        const newEnquiry = await Enquiry.create(req.body);
        res.json(newEnquiry);
    } catch (error) {
        throw new Error(error)
    }
});

const updateEnquiry = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const newEnquiry = await Enquiry.findByIdAndUpdate({_id: id},req.body,{new: true});
        res.json(newEnquiry);
    } catch (error) {
        throw new Error(error)
    }
});

const deleteEnquiry = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const deleteEnquiry = await Enquiry.findByIdAndDelete({_id: id});
        res.json(deleteEnquiry);
    } catch (error) {
        throw new Error(error)
    }
});

const getEnquiry = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const getEnquiry = await Enquiry.findById({_id: id});
        res.json(getEnquiry);
    } catch (error) {
        throw new Error(error)
    }
});

const getAllEnquiry = asyncHandler(async(req,res) => {
    try {
        const getAllEnquiry = await Enquiry.find();
        res.json(getAllEnquiry);
    } catch (error) {
        throw new Error(error)
    }
});

module.exports = {
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getEnquiry,
    getAllEnquiry
}