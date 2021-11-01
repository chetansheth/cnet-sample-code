import Vue from 'vue'
import Vuex from 'vuex'
import { createStore } from 'vuex-extensions'
import { FeathersVuex } from '../feathers-client'
import auth from './store.auth'


Vue.use(Vuex)
Vue.use(FeathersVuex)

const requireModule = require.context(
  // The path where the service modules live
  './services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /\.js$/
)
const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default)

export default createStore(Vuex.Store, {
  state: {
    currentOrganisation: null
  },
  mutations: {
    setCurrentOrganisation(state, organisation){
      state.currentOrganisation = organisation;
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [...servicePlugins, auth]
})
