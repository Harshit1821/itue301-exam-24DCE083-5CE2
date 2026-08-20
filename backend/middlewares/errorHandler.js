/**
 * Global Error Handling Middleware (Task 3 & Task 5 Requirement)
 * Returns a structured JSON response instead of exposing the raw error stack.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
      value: e.value,
    }));
  }

  // Handle Mongoose Duplicate Key Error (e.g. unique email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value entered for '${field}'. Must be unique.`;
  }

  // Handle Mongoose Cast Error (Invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found. Invalid ID format for ${err.path}.`;
  }

  // Return structured response
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    ...(errors && { errors }),
  });
};

module.exports = errorHandler;
