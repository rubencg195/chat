module.exports = function (options = {}) {
  return function channel(req, res, next) {
    console.log('channel middleware is running');
    res.sendfile('./public/index.html');
    // next();
  };
};
