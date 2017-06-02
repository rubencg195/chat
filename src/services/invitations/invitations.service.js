// Initializes the `invitations` service on path `/invitations`
const createService = require('feathers-nedb');
const createModel = require('../../models/invitations.model');
const hooks = require('./invitations.hooks');
const filters = require('./invitations.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'invitations',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/invitations', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('invitations');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
