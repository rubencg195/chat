// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
//   return function (hook) {
    
//     return Promise.resolve(hook);
//   };
// };

const mailer = require('../mail-config');
 
 module.exports = function(options = {}) {
   return function(hook) {
   	// Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
     console.log("HERE");
     // console.log(hook);
     console.log(hook.result);
     mailer.mailer.create({
        from: 'vacster.spam@gmail.com',
        to: hook.result.email,
        subject: 'Welcome to Our Chat!',
        // html: 'Follow this link to get you started!<br><a href="http://localhost:3030/validation/' hook.result._id '">Register Account</a>'
        html: '<h1>Welcome '+hook.result.name+'</h1><h2>Click on the link to activate your account '+hook.result.email+'</h2><br><br><a href="http://localhost:3030/activate?id='+hook.result._id+'&name='+hook.result.name+'&email='+hook.result.email+'">Click Here</a><br><br><img src="https://i.imgflip.com/hjjdh.jpg">'
     }).then(function (result) {
       console.log('Sent email', result);
     }).catch(err => {
       console.log(err);
     });
   }
 }


