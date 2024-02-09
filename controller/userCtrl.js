const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const uniqid = require("uniqid");

const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const validateMongoDbId = require("../utils/validateMongodbId");
const sendEmail = require("./emailCtrl");

const createUserCtrl = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findEmail = await User.findOne({ email });
  if (!findEmail) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser) {
    const checkPass = await findUser.isPasswordMatched(password);
    if (checkPass) {
      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateUser = await User.findByIdAndUpdate(
        findUser._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 100,
      });
      res.json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser?._id),
      });
    } else {
      throw new Error("Invalid Password");
    }
  } else {
    throw new Error("Invalid Email");
  }
});

const loginAdminCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin) {
    const checkPass = await findAdmin.isPasswordMatched(password);
    if (checkPass) {
      const refreshToken = await generateRefreshToken(findAdmin?._id);
      const updateUser = await User.findByIdAndUpdate(
        findAdmin._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 100,
      });
      res.json({
        _id: findAdmin?._id,
        firstname: findAdmin?.firstname,
        lastname: findAdmin?.lastname,
        email: findAdmin?.email,
        mobile: findAdmin?.mobile,
        token: generateToken(findAdmin?._id),
      });
    } else {
      throw new Error("Invalid Password");
    }
  } else {
    throw new Error("Invalid Email");
  }
});

const handleRefreshTokenCtrl = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something Wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

const handleLogoutCtrl = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh token in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

const getAllUserCtrl = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);
    res.json({ user });
  } catch (error) {
    throw new Error(error);
  }
});

const updateUserCtrl = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
        password: req?.body?.password,
      },
      {
        new: true,
      }
    );
    res.json({ updateUser });
  } catch (error) {
    throw new Error(error);
  }
});

const saveAddressCtrl = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const updateAddressUser = await User.findByIdAndUpdate(
      id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updateAddressUser);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteUserCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({ deleteUser });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUserCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const userBlock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({ message: "User Blocked" });
  } catch (error) {
    throw new Error(error);
  }
});

const unBlockUserCtrl = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const userBlock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({ message: "User UnBlocked" });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (user) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json({ msg: "don't find user" });
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi please follow this link to reset your password. This link is valid till 
        10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}>Click here</a>`;
    const data = {
      to: email,
      subject: "Forgot Password",
      html: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expried, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishListCtrl = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const findUser = await User.findById(id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

const userCartCtrl = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { cart } = req.body;
  try {
    let products = [];
    const user = await User.findById(id);
    const alreadyExitsCart = await Cart.findOne({ orderBy: user._id });
    console.log(alreadyExitsCart);
    if (alreadyExitsCart) {
      alreadyExitsCart.deleteOne();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderBy: user._id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCartCtrl = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const cart = await Cart.findOne({ orderBy: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCartCtrl = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndDelete({ orderBy: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCouponCtrl = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({
    orderBy: user._id,
  }).populate("products.product");
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  const cartAfterDiscount = await Cart.findOneAndUpdate(
    {
      orderBy: user._id,
    },
    {
      totalAfterDiscount,
    },
    {
      new: true,
    }
  );
  res.json(cartAfterDiscount);
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  try {
    if (!COD) throw new Error("Create cash order failed");
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderBy: user._id });
    let finalAmout = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmout = userCart.totalAfterDiscount;
    } else {
      finalAmout = userCart.cartTotal;
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmout,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderBy: user._id,
      orderStatus: "Cash on Delivery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const userOrders = await Order.findOne({ orderBy: _id })
      .populate(["products.product", "orderBy"])
      .exec();
    res.json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllOrder = asyncHandler(async (req, res) => {
  try {
    const allOrder = await Order.find()
      .populate(["products.product", "orderBy"])
      .exec();
    res.json(allOrder);
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    const findOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      {
        new: true,
      }
    );
    res.json(findOrder);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createUserCtrl,
  loginUserCtrl,
  getAllUserCtrl,
  getUserCtrl,
  deleteUserCtrl,
  updateUserCtrl,
  blockUserCtrl,
  unBlockUserCtrl,
  handleRefreshTokenCtrl,
  handleLogoutCtrl,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdminCtrl,
  getWishListCtrl,
  saveAddressCtrl,
  userCartCtrl,
  getUserCartCtrl,
  emptyCartCtrl,
  applyCouponCtrl,
  createOrder,
  getOrders,
  getAllOrder,
  updateOrderStatus,
};
