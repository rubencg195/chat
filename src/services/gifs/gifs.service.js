// Initializes the `gifs` service on path `/gifs`
const createService = require('feathers-nedb');
const createModel = require('../../models/gifs.model');
const hooks = require('./gifs.hooks');
const filters = require('./gifs.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'gifs',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gifs', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('gifs');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
