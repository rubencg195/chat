const messages = require('./messages/messages.service.js');
const users = require('./users/users.service.js');
const rooms = require('./rooms/rooms.service.js');
const contacts = require('./contacts/contacts.service.js');
const invitations = require('./invitations/invitations.service.js');
const gifs = require('./gifs/gifs.service.js');
const notifications = require('./notifications/notifications.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(messages);
  app.configure(users);
  app.configure(rooms);
  app.configure(contacts);
  app.configure(invitations);
  app.configure(gifs);
  app.configure(notifications);
};
