

// Middleware to protect /trunk endpoint
const protectEndpoint = (req, res, next) => {
  // Check for a custom header (you can modify this based on your authentication/authorization mechanism)
  const apiKey = req.headers['x-api-key'];

  // Add your security logic here
  if (apiKey === 'your_secret_key') {
    // If the key is valid, proceed to the next middleware or route handler
    next();
  } else {
    // If the key is invalid, send a forbidden response
    res.status(403).json({ error: 'Access forbidden' });
  }
};


module.exports = {
  protectEndpoint
};
