module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Error interno del servidor";

  res.status(statusCode).json({
    ok: false,
    error: message,
  });
};