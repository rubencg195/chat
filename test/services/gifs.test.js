const assert = require('assert');
const app = require('../../src/app');


describe('\'gifs\' service', () => {
  it('registered the service', () => {
    const service = app.service('gifs');

    assert.ok(service, 'Registered the service');
  });
});



