// src/store/services/bikes.js
import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Bike extends BaseModel {}

Bike.modelName = 'Bike'
Bike.instanceDefaults = function() {
  return {
    
  }
}

const servicePath = 'bikes'
const servicePlugin = makeServicePlugin({
  Model: Bike,
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