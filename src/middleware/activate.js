module.exports = function (options = {}) {
  return function activate(req, res, next) {
    console.log('activate middleware is running');
    // console.log(req);
    res.sendfile('./public/index.html');
    // next();
  };
};
