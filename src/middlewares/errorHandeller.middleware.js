const errorHandeler = (err, req, res, next)=>{
    let statusCode = 500;
    
    if(!err.statusCode && err.name=='ValidationError') statusCode = 400

    return res
    .status(err.statusCode || statusCode)
    .json({
        statusCode : err.statusCode || statusCode,
        message: err.message,
        stack: err.stack,
        success : false
    });
}

export default errorHandeler