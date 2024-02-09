const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const Product = require("../models/productModel");
const User = require("../models/userModel");
const createProductCtrl = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProductCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProductCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findOneAndDelete({ _id: id });
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getProductCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProductCtrl = asyncHandler(async (req, res) => {
  try {
    const queryObj = { ...req.query };
    // const excludeFields = ["page","sort","limit","fields"];
    // const queryObj2 = excludeFields.forEach((el) => delete queryObj[el]);
    const allProduct = await Product.find(queryObj);
    res.json(allProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyAdded = user.wishlist.find(
      (id) => id.toString() === productId
    );
    if (alreadyAdded) {
      const newUser = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: productId },
        },
        {
          new: true,
        }
      );
      res.json(newUser);
    } else {
      const newUser = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: productId },
        },
        {
          new: true,
        }
      );
      res.json(newUser);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, productId } = req.body;
  try {
    const product = await Product.findById(productId);
    const alreadRated = product.ratings.find(
      (user) => user.postedby.toString() === _id.toString()
    );
    if (alreadRated) {
      await Product.updateOne(
        {
          ratings: { $elemMatch: alreadRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        { new: true }
      );
    } else {
      await Product.findByIdAndUpdate(
        productId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        { new: true }
      );
    }
    const getTotalrating = await Product.findById(productId);
    const totalRating = getTotalrating.ratings.length;
    const ratingSum = getTotalrating.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    const actualRating = Math.round(ratingSum / totalRating);
    const finalProduct = await Product.findByIdAndUpdate(
      productId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProductCtrl,
  getProductCtrl,
  getAllProductCtrl,
  updateProductCtrl,
  deleteProductCtrl,
  addToWishList,
  rating,
};
