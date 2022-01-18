
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || " Something went wrong try again later",
  };

  if (err.name === "validationError") {
    customError.msg = Object.values(err.error).map((item) =>
      item.message.join(",")
    );
    customError.statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    customError.msg = " Duplicate Email, please choose another email";
    customError.statusCode = 400;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
