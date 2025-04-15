// Makes it easier to have endpoints with asynchronous handlers.
// This makes things like database calls a lot easier.
const asyncHandler = (func) => (req, res, next) => {
  Promise.resolve(func(req, res, next)).catch(next);
};

module.exports = {
  asyncHandler,
};
