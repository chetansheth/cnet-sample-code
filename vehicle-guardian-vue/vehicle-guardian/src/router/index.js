import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    beforeEnter(to, from, next) {
      store.dispatch('auth/authenticate').then(() => {
        next('/dashboard');
      }).catch(() => {
        next();
      });
    },
    component: Login
  },
  {
    path: '/signup',
    name: 'SignUp',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/SignUp.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    alias: '/',
    beforeEnter: guardLogin,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
  },
  {
    path: '/create-org',
    name: 'CreateOrganisation',
    beforeEnter: guardLogin,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateOrganisation.vue')
  },
  {
    path: '/user',
    name: 'UserSettings',
    beforeEnter: guardLogin,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/UserSettings.vue')
  },
  {
    path: '/organisation',
    name: 'OrganisationSettings',
    beforeEnter: guardLogin,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/OrganisationSettings.vue')
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    beforeEnter: guardLogin,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Vehicles.vue')
  },
  {
    path: '/bikes',
    name: 'Bikes',
    beforeEnter: guardLogin,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Bikes.vue')
  },
  {
    path: '/create-vehicle',
    name: 'CreateVehicle',
    beforeEnter: guardLogin,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateVehicle.vue')
  },
  {
    path: '/create-bike',
    name: 'CreateBike',
    beforeEnter: guardLogin,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateBike.vue')
  },
  {
    path: '/vehicle/:vehicle_id',
    name: 'VehicleLog',
    beforeEnter: guardLogin,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/VehicleLog.vue')
  },
  {
    path: '/vehicle/:vehicle_id/incident/:log_id',
    name: 'Incident',
    beforeEnter: guardLogin,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Incident.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

function guardLogin(to, from, next) {
  store.dispatch('auth/authenticate').then(() => {
    next();
  }).catch(() => {
    next('/login');
  });
}

export default router
