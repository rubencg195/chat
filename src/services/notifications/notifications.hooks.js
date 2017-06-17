const creationMail = require('../../hooks/notification-action');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [creationMail()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
