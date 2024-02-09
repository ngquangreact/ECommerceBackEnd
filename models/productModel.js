const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        require: true,
        select: false,
    },
    sold: {
        type: Number,
        default: 0,
        select: false,
    },
    images: [],
    colors: [],
    tags: [],
    ratings: [
        {
            star: Number,
            comment: String,
            postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
        }
    ],
    totalrating: {
        type: Number,
        default: 0,
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Product",productSchema);