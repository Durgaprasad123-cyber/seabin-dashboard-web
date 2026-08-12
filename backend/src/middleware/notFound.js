/**
 * 404 Not Found Middleware
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = notFound;
