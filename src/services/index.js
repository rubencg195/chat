const messages = require('./messages/messages.service.js');
const users = require('./users/users.service.js');
const rooms = require('./rooms/rooms.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(messages);
  app.configure(users);
  app.configure(rooms);
};
