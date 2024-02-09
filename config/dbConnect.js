const { default: mongoose } = require("mongoose");

const dbConnect = () => {
    try {
        const connect = mongoose.connect(process.env.MONGODB_URL);
        console.log("connect Mongo success");
    } catch (error) {
        console.log("connect Mongo error");
    }
}

module.exports = dbConnect;