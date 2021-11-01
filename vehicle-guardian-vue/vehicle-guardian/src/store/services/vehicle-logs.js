// src/store/services/vehicle-logs.js
import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'
import { DateTime } from 'luxon'

class VehicleLogs extends BaseModel {}

VehicleLogs.modelName = 'VehicleLogs'
VehicleLogs.instanceDefaults = function() {
  return {
    
  }
}

const servicePath = 'vehicle-logs'
const servicePlugin = makeServicePlugin({
  Model: VehicleLogs,
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
    find: [context => {
      const { result } = context;
      for(let ii in result.data){
        // convert date string to DateTime
        result.data[ii].startTimestamp = DateTime.fromISO(result.data[ii].startTimestamp, {zone: 'utc'}).toJSDate();
        result.data[ii].endTimestamp = DateTime.fromISO(result.data[ii].endTimestamp, {zone: 'utc'}).toJSDate();
      }
      return context;
    }],
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