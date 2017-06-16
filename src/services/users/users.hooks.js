'use strict';

const { authenticate } = require('feathers-authentication').hooks;
const { hashPassword } = require('feathers-authentication-local').hooks;
const commonHooks  = require('feathers-hooks-common');
const gravatar = require('../../hooks/gravatar');
const { populate } = require('feathers-hooks-common');
const creationMail = require('../../hooks/creation-mail');
const regex = require('../../hooks/regex');


module.exports = {
  before: {
    // all: [],
    // find: [ authenticate('jwt') ],
    // get: [ authenticate('jwt') ],
    // create: [hashPassword(), gravatar()],
    // update: [ authenticate('jwt') ],
    // patch: [ authenticate('jwt') ],
    // remove: [ authenticate('jwt') ]
    all: [],
    find: [],
    get: [],
    create: [regex(), hashPassword(), gravatar()],
    update: [],
    patch: [],
    remove: [],
  },
//populate("info",{ service: "users", field: "_id"})
  after: {
    all: [commonHooks.when(hook => hook.params.provider, commonHooks.discard('password'))],
    find: [],
    get: [],
    create: [creationMail()],
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
