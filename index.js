const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

const dbConnect = require("./config/dbConnect");
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const prodcategoryRouter = require("./routes/prodcategoryRoute");
const blogcategoryRouter = require("./routes/blogcategoryRoute");
const brandRouter = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const enqRouter = require("./routes/enqRoute");
const couponRouter = require("./routes/couponRoute");
const uploadRouter = require("./routes/uploadRoute");

const { notFound, errorHandle } = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());

dbConnect();

const jsonParser = bodyParser.json();
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());
app.use("/api/user", jsonParser, authRouter);
app.use("/api/product", productRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/blog", blogRouter);
app.use("/api/prod-category", prodcategoryRouter);
app.use("/api/blog-category", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);

app.use(notFound);
app.use(errorHandle);

app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
});
