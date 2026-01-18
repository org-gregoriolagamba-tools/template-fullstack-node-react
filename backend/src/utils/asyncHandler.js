/**
 * Async Handler Utility
 * 
 * Wraps async route handlers to automatically catch errors
 * and pass them to the Express error handler.
 */

/**
 * Wrap an async function to catch errors automatically
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware with error handling
 * 
 * @example
 * // Instead of:
 * router.get('/', async (req, res, next) => {
 *   try {
 *     const data = await someAsyncOperation();
 *     res.json(data);
 *   } catch (error) {
 *     next(error);
 *   }
 * });
 * 
 * // Use:
 * router.get('/', catchAsync(async (req, res) => {
 *   const data = await someAsyncOperation();
 *   res.json(data);
 * }));
 */
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Alias for backward compatibility
export const asyncHandler = catchAsync;
