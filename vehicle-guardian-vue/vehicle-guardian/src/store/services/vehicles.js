// src/store/services/vehicles.js
import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Vehicle extends BaseModel {}

Vehicle.modelName = 'Vehicle'
Vehicle.instanceDefaults = function() {
  return {
    
  }
}

const servicePath = 'vehicles'
const servicePlugin = makeServicePlugin({
  Model: Vehicle,
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