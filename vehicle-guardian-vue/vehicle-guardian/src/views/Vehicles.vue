<template>
  <v-container class="pa-8">
    <v-row>
      <v-col cols=3>
        <v-card>
          <v-card-title>
            Licenses in Use
          </v-card-title>
          <v-card-text class="text-center text-h3">
            {{nLicensesInUse}} / {{totalLiceses}}
          </v-card-text>
          <v-card-text>
            Subscription Status: <span class="accent--text">{{subscriptionStatus}}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Vehicle List
            <v-spacer/>
            <v-btn
                color="accent"
                to="/create-vehicle"
            >
              Add Vehicle
            </v-btn>
          </v-card-title>
          <v-row justify="center">
            <v-col cols=11>
              <v-data-table
                class="px-0"
                :headers="vehicleTableHeaders"
                :items="vehiclesList"
                :search="vehicleSearch"
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn
                    icon
                    @click="viewVehicle(item)"
                  >
                    <v-icon
                      small
                      
                    >
                      mdi-eye
                    </v-icon>
                  </v-btn>
                  <v-btn
                    icon
                  >
                    <v-icon
                      small
                      @click="deleteItem(item)"
                    >
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    data() {
      return {
        vehicleSearch: "",
        vehicleTableHeaders: [
          {
            text: "Vehicle Registration",
            align: "start",
            sortable: false,
            value: "registration"
          },
          {
            text: "Type",
            value: "type"
          },
          {
            text: "Colour",
            value: "colour"
          },
          {
            text: "System ID",
            sortable: false,
            value: "systemId"
          },
          {
            text: 'Actions',
            sortable: false,
            value: 'actions'
          }
        ]
      }
    },
    methods: {
      ...mapActions('vehicles', { findVehicles: 'find' }),
      viewVehicle(item){
        this.$router.push({ name: 'VehicleLog', params: { vehicle_id: item._id.toString() }})
      }
    },
    watch: {
      currentOrganisation: function(org){
        this.findVehicles({query: {
          organisation_id: org._id
        }})
      }
    },
    computed: {
      ...mapState(['currentOrganisation']),
      ...mapGetters('vehicles', { findVehiclesInStore: 'find' } ),
      vehiclesList(){
        return this.findVehiclesInStore({query: {
          organisation_id: this.currentOrganisation._id
        }}).data
      },
      nLicensesInUse(){
        return this.currentOrganisation.nVehiclesInUse
      },
      totalLiceses(){
        return this.currentOrganisation.subscription.nVehicleLicenses
      },
      subscriptionStatus(){
        let rawStatus = this.currentOrganisation.subscription.status
        let formattedStatus = "Error"
        if((typeof rawStatus === 'string' || rawStatus instanceof String) && rawStatus.length > 1){
          // Upper case first, lowercase rest
          formattedStatus = rawStatus[0].toUpperCase() + rawStatus.slice(1).toLowerCase()
        }
        return formattedStatus
      }
    },
    created () {
    }
  }
</script>