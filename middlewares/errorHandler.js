const notFound = (req,res,next) => {
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandle = (err,req,res,next) => {
    console.log(res.statusCode)
    const statusCode = res.statusCode == 200 ? 500 : statusCode;
    res.status(statusCode);
    res.json({
        message: err?.message,
        stack: err?.stack
    });
};

module.exports = {errorHandle, notFound};