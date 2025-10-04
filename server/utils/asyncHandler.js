/**
 * @file utils/asyncHandler.js
 * @description Wrapper for async route handlers to catch errors
 */

/**
 * Wraps async route handlers to catch errors and pass them to error middleware
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
