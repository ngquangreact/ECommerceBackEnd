const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const ObjectId = require('mongodb').ObjectId;
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        retuired: true
    },
    role: {
        type: String,
        default: "user"
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: []
    },
    wishlist: [{type: ObjectId, ref: "Product"}],
    address: {
        type: String,
    },
    refreshToken: {
        type: String
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},
{
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if(!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

userSchema.methods.isPasswordMatched = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
};

userSchema.methods.createPasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 30*60*1000;
    return resetToken;
};

module.exports = mongoose.model("User",userSchema);