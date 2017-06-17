// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const mailer = require('../mail-config');
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    console.log("HERE Notification");
     console.log(hook.data);
     if(hook.data.type == "block"){
     	console.log("Blocking Account");
     }

     mailer.mailer.create({
        from: 'vacster.spam@gmail.com',
        to: hook.data.userEmail,
        subject: hook.data.title,
        html: hook.data.text
     }).then(function (result) {
       console.log('Sent email', result);
     }).catch(err => {
       console.log(err);
     });

    return Promise.resolve(hook);
  };
};
