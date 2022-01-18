const errorHandlerMiddleware = (req, res, next) => {
  const statusCode = 400;
  const message = "Error, not found"
  next({statusCode, message})
}

const showErrors = (error ,req, res, next) => {
  const {statusCode = 500, message = 'Auth error'} = error;
  res.status(statusCode).json({message})
}

module.exports = {errorHandlerMiddleware, showErrors};