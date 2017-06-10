module.exports = function (options = {}) {
  return function validate(req, res, next) {
    console.log('validate middleware is running');
    console.log(req.url);
    next();
  };
};
