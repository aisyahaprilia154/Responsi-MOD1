export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) console.error(error);

  const response = {
    success: false,
    message: error.message || "Terjadi kesalahan pada server."
  };

  if (error.details) response.details = error.details;

  res.status(statusCode).json(response);
}
