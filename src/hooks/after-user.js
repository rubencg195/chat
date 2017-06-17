// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const jwt = require('feathers-authentication-jwt');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    // var decoded = jwt.decode(hook.data.token);

	// get the decoded payload and header
	// var decoded = jwt.decode(hook.data.token, {complete: true});
	// console.log(decoded.header);
	// console.log(decoded.payload);
	console.log("AFTER");
	// console.log(hook.data);

	// return hook.app.service('otherservice').find({
 //      query: { email: hook.data.email }
 //    }).then(page => {
 //      const usr = page.data;

 //      hook.data = { usr };

 //      // IMPORTANT: always return the `hook` object in the end
 //      return hook;
 //    });

    return Promise.resolve(hook);
  };
};
