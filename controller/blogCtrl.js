const asyncHandler = require("express-async-handler");
const fs = require("fs");

const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const validateMongoDbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");

const createBlogCtrl = asyncHandler(async(req,res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const updateBlogCtrl = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const updateBlog = await Blog.findOneAndUpdate({_id: id},req.body,{new: true});
        res.json(updateBlog);
    } catch (error) {
        throw new Error(error)
    }
});

const getBlogCtrl = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const getBlog = await Blog.findById(id).populate("likes").populate("dislikes");
        await Blog.findByIdAndUpdate({_id: id},{
            $inc: {numViews: 1},
        },{
            new: true
        });
        res.json(getBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBlogCtrl = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
        const deleteBlog = await Blog.findOneAndDelete({_id: id});
        res.json(deleteBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllBlogCtrl = asyncHandler(async(req,res) => {
    try {
        const allBlog = await Blog.find();
        res.json(allBlog);
    } catch (error) {
        throw new Error
    }
});

const likeBlog = asyncHandler(async(req,res) => {
    const {blogId} = req.body;
    const blog = await Blog.findById(blogId);
    
    const loginUserId = req?.user?._id;
    const isLiked = blog.isLiked;
    const alreadyLiked = blog?.dislikes.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if(alreadyLiked) {
        const newBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {dislikes: loginUserId},
                isDisliked: false
            },{new: true}
        );
        res.json(newBlog)
    };
    if(isLiked) {
        const newBlog = await Blog.findByIdAndUpdate(blogId,{
            $pull: {likes: loginUserId},
            isLiked: false
        },{ new: true});
        res.json(newBlog);
    } else {
        const newBlog = await Blog.findByIdAndUpdate(blogId,{
            $push: {likes: loginUserId},
            isLiked: true
        },{new: true});
        res.json(newBlog);
    };
});

const dislikeBlog = asyncHandler(async(req,res) => {
    const {blogId} = req.body;
    const blog = await Blog.findById(blogId);
    
    const loginUserId = req?.user?._id;
    const isDisliked = blog.isDisliked;
    const alreadyDisliked = blog?.likes.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if(alreadyDisliked) {
        const newBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {likes: loginUserId},
                isLiked: false
            },{new: true}
        );
        res.json(newBlog)
    };
    if(isDisliked) {
        const newBlog = await Blog.findByIdAndUpdate(blogId,{
            $pull: {dislikes: loginUserId},
            isDisliked: false
        },{ new: true});
        res.json(newBlog);
    } else {
        const newBlog = await Blog.findByIdAndUpdate(blogId,{
            $push: {dislikes: loginUserId},
            isDisliked: true
        },{new: true});
        res.json(newBlog);
    };
});

const uploadImages = asyncHandler(async(req,res) => {
    const { id } = req.params;
    try {
        const uploader = (path) => cloudinaryUploadImg(path,"images");
        const urls = [];
        const files = req.files;
        console.log(files)
        for(const file of files) {
            const {path} = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path);
        };
        const findBlog = await Blog.findByIdAndUpdate(
            {_id: id},
            {
                images: urls.map((file) => {
                    return file;
                })
            },
            {
                new: true
            }
        );
        res.json(findBlog);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createBlogCtrl,
    updateBlogCtrl,
    getBlogCtrl,
    deleteBlogCtrl,
    getAllBlogCtrl,
    likeBlog,
    dislikeBlog,
    uploadImages
}