const mailer = require('../mail-config');

module.exports = function() {
  return function(hook) {
    console.log("HERE");
    console.log(hook.result);
    mailer.mailer.create({
       from: 'vacster.spam@gmail.com',
       to: hook.result.email,
       subject: 'Welcome to FeatherJS Chat!',
       html: 'Follow this link to get you started!<br><a href="http://localhost:3030/validation/'+ hook.result._id +'">Register Account</a>'
    }).then(function (result) {
      console.log('Sent email', result);
    }).catch(err => {
      console.log(err);
    });
  }
}
