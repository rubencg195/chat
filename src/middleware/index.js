const handler = require('feathers-errors/handler');
const notFound = require('feathers-errors/not-found');

const signup = require('./signup');

const login = require('./login');

const chat = require('./chat');

const channel = require('./channel');

const dashboard = require('./dashboard');

module.exports = function () {
  // Add your custom middleware here. Remember, that
  // in Express the order matters, `notFound` and
  // the error handler have to go last.
  const app = this;

  app.use('/signup', signup());

  app.use('/login', login());

  app.use('/chat', chat());

  app.use('/channel', channel());

  app.use('/dashboard', dashboard());

  app.use(notFound());
  app.use(handler());
};
