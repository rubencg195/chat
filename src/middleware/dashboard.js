module.exports = function (options = {}) {
  return function dashboard(req, res, next) {
    console.log('dashboard middleware is running');
    res.sendfile('./public/index.html');
    // next();
  };
};
