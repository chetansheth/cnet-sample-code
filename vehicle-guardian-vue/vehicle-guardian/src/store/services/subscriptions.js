// src/store/services/subscriptions.js
import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Subscription extends BaseModel {}

Subscription.modelName = 'Subscription'
Subscription.instanceDefaults = function() {
  return {
    
  }
}

const servicePath = 'subscriptions'
const servicePlugin = makeServicePlugin({
  Model: Subscription,
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