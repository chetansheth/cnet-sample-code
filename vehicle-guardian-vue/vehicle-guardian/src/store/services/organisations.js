// src/store/services/organisations.js
import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Organisation extends BaseModel {}

Organisation.modelName = 'Organisation'
Organisation.instanceDefaults = function() {
  return {
  }
}

const servicePath = 'organisations'
const servicePlugin = makeServicePlugin({
  Model: Organisation,
  service: feathersClient.service(servicePath),
  servicePath
})

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
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
})

export default servicePlugin