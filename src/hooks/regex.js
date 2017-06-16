
module.exports = function() {
  return function(hook) {
    console.log(hook.data.password);
    var regularExpression = /^(?=.*?[A-Z])(?=.*?[0-9]).{8,}$/;
    if(!regularExpression.test(hook.data.password)) {
      throw new Error('Password doesn\'t meet minimum requirements');
    }
  }
}
