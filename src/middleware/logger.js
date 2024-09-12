// src/middleware/logger.js

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // Pass control to the next middleware
  };
  
  module.exports = logger;
  