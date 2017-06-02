module.exports = function (options = {}) {
  return function login(req, res, next) {
    console.log('login middleware is running');
    res.sendfile('./public/index.html');
    // next();
  };
};
