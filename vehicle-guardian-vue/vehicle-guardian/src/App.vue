<template>
  <v-app style="background: #FAFAFA">
    <v-app-bar
      app
      color="primary"
      dark
      clipped-left
      clipped-right
    >
      <v-container fluid>
        <v-row align="center">
          <v-col cols=6>
            <div class="d-flex align-center">
              <v-avatar
                color="secondary"
                size="40"
              />

              <v-toolbar-title class="ml-4">CAV Guardian</v-toolbar-title>
              
            </div>
          </v-col>
          
          <v-spacer></v-spacer>
          <v-col cols=2 align="end">
            <v-menu v-if="isAuthenticated" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  dark
                  text
                  outlined
                  block
                  color="secondary"
                  class="text-none"
                >
                  {{orgDropdownText}}
                  <v-spacer></v-spacer>
                  <v-icon dark right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list nav dense>
                <v-list-item-group v-model="currentOrgIdx">
                  <v-list-item
                    v-for="(org, index) in organisations"
                    :key="index"
                    :disabled="org.disabled"
                  >
                    <v-list-item-title>{{ org.name }}</v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <v-divider />
              <v-list dense>
                <v-list-item @click="gotoCreateOrg">
                  <v-list-item-title>Add organisation</v-list-item-title>
                  <v-list-item-icon><v-icon>mdi-plus</v-icon></v-list-item-icon>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
          <v-col cols=1 align="center">
            <span class="subtitle-1" v-if="isAuthenticated">Hello {{displayName}}!</span>
          </v-col>
        </v-row>
      </v-container>
        
    </v-app-bar>

    <v-navigation-drawer
      app
      nav
      left
      clipped
      stateless
      :value="isAuthenticated"
      color="primary"
    >
      <v-container class="pa-0">
        <v-row>
          <v-col>
            <v-list
              dense
              dark
              nav
            >
              <v-list-item
                v-for="item in navItems"
                :key="item.title"
                :to="item.to"
                :disabled="organisations.length == 0 && item.title != 'User' && item.title != 'Dashboard'"
                link
              >
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                link
                @click="logout"
              >
                <v-list-item-icon>
                  <v-icon>mdi-logout-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Log Out</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
      
    </v-navigation-drawer>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'

export default {
  name: 'App',

  data: () => ({
    navItems: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard', to: "/dashboard" },
      { title: 'Vehicles', icon: 'mdi-car-estate', to: '/vehicles' },
      { title: 'Bikes', icon: 'mdi-bike', to: '/bikes' },
      { title: 'Organisation', icon: 'mdi-cog', to: '/organisation' },
      { title: 'Billing', icon: 'mdi-credit-card' },
      { title: 'User', icon: 'mdi-account', to: "/user" },
    ],
  }),
  methods: {
    ...mapActions('auth', {authLogout: 'logout'}),
    ...mapActions("auth", ["authenticate"]),
    ...mapActions("organisations", { findOrganisations: "find" }),
    ...mapMutations(['setCurrentOrganisation']),
    logout(){
      this.authLogout().then(() => {
        localStorage.removeItem('accessToken')
        this.$store.reset()
        this.$router.push('/login')
      })
    },
    gotoCreateOrg(){
      this.$router.push('/create-org')
    }
  },
  computed: {
    ...mapState(['currentOrganisation']),
    ...mapState('organisations', { areOrgsLoading: 'isFindPending' }),
    ...mapGetters('organisations', { findOrgsInStore: 'find' }),
    ...mapGetters('auth', [
      'user',
      'isAuthenticated'
    ]),
    displayName(){
      return this.isAuthenticated ? this.user.name : ''
    },
    organisations(){
      let orgs = this.findOrgsInStore({query: {}}).data
      for(let org of orgs){
        if(this.currentOrganisation != null && org._id == this.currentOrganisation._id){
          org.disabled = true
        } else {
          org.disabled = false
        }
      }

      return orgs
    },
    username(){
      return this.user.name
    },
    orgDropdownText(){
      let orgText = "Select Organisation"
      if (this.currentOrganisation != null){
        orgText = this.currentOrganisation.name
      }

      return orgText
    },
    currentOrgIdx: {
      get: function (){
        let orgIdx = 0;
        if (this.currentOrganisation != null && this.organisations.length > 0){
          for(orgIdx in this.organisations){
            if (this.organisations[orgIdx]._id == this.currentOrganisation._id){
              break;
            }
          }
        }
        return orgIdx++
      },
      set: function (idx){
        this.setCurrentOrganisation(this.organisations[idx])
        return idx
      }
    }
  },
  async updated(){
    if(this.isAuthenticated){
      console.log('Get orgs...')
      let res = await this.findOrganisations({ query: {} })
      if(res.total > 0 && this.currentOrganisation == null){
        this.setCurrentOrganisation(res.data[0])
      }
    }
    console.log('App Updated')
  }
};
</script>
