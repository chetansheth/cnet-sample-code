import feathers from "@feathersjs/feathers";
import auth from "@feathersjs/authentication-client";
import feathersVuex from "feathers-vuex";
import socketio from "@feathersjs/socketio-client";
import io from "socket.io-client";
import { iff, discard } from "feathers-hooks-common";

const socket = io(process.env.VUE_APP_LOCAL, { transports: ["websocket"], path: '/socket.io' });

console.log(socket);

const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: window.localStorage }))
  .hooks({
    before: {
      all: [
        iff(
          (context) => ["create", "update", "patch"].includes(context.method),
          discard("__id", "__isTemp")
        ),
      ],
    },
    after: {
      all: [
        iff(
          (context) => ["create", "update", "patch"].includes(context.method),
          discard("__id", "__isTemp")
        ),
      ],
    },
  });

export default feathersClient;

const {
  makeServicePlugin,
  makeAuthPlugin,
  BaseModel,
  models,
  FeathersVuex,
} = feathersVuex(feathersClient, {
  serverAlias: "api", 
  idField: "_id",
  whitelist: ["$regex", "$options"],
});

export { makeAuthPlugin, makeServicePlugin, BaseModel, models, FeathersVuex };