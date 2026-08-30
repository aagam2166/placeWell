const errorHandler = (err, req, res, next) => {
 
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  
  console.error("Unexpected Error:", err);
  return res.status(500).json({
    success: false,
    error: "Internal server error",
  });
};

module.exports = errorHandler;
