module.exports = function (options = {}) {
  return function chat(req, res, next) {
    console.log('chat middleware is running');
    res.sendfile('./public/index.html');
    // next();
  };
};
