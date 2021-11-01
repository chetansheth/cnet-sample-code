<template>
  <v-container class="pa-8">
    {{displayNoOrgsMsg}}
    <v-row v-if="displayNoOrgsMsg" class="ma-5">
      <v-col>
        <div class=text-center>
          <h4>It looks like you don't have any Organisations</h4>
          <v-btn
            text
            color="accent"
            to="/create-org"
          >
            Set one up
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="!displayNoOrgsMsg">
      <v-col cols=6>
        <v-card height="100%">
          <v-card-title>
            Recent Incidents
          </v-card-title>
          <v-data-table
            class="mx-4"
            :headers="incidentTableHeaders"
            :items=vehicleLogList
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                icon
                @click="viewIncident(item)"
              >
                <v-icon
                  small
                >
                  mdi-eye
                </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols=6>
        <v-card height="100%">
          <v-card-title>
            Incident Locations
          </v-card-title>
          <div class="pa-4">
            <l-map
              :zoom="mapZoom"
              :center="mapCenter"
              :options="mapOptions"
              style="height: 500px; width: 100%"
            >
              <l-tile-layer
                :url="mapUrl"
                :attribution="mapAttribution"
              ></l-tile-layer>
            </l-map>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="!displayNoOrgsMsg">
      <v-col cols=12>
        <v-card>
          <v-card-title>
            Summary
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
  import { latLng } from "leaflet";
  import { LMap, LTileLayer } from "vue2-leaflet";
  import { DateTime } from "luxon"
  import _ from "lodash"

  export default {
    name: "Dashboard",
    components: {
      LMap,
      LTileLayer
    },
    data(){
      return {
        dates: [DateTime.now().minus({days:7}).toISODate(),DateTime.now().toISODate()],
        mapZoom:6,
        mapOptions: {},
        mapUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        mapAttribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        mapCenter: latLng([54.00366, -2.547855]), // rough center of uk
        incidentTableHeaders: [
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
            text: "Date",
            value: "date"
          },
          {
            text: "Time",
            value: "time"
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
      ...mapActions('vehicle-logs', { findVehicleLogs: 'find' }),
      ...mapMutations(['setCurrentOrganisation']),
      async updateVehicleLogs(){
        await this.findVehicleLogs({
          query: {
            organisation_id: this.currentOrganisation._id,
            startTimestamp: this.dates[0],
            endTimestamp: this.dates[1]
          }
        })
      }
    },
    watch: {
      currentOrganisation: function(){
        this.updateVehicleLogs()
      }
    },
    computed: {
      ...mapState(['currentOrganisation']),
      ...mapGetters('organisations', { findOrgsInStore: 'find' }),
      ...mapGetters('vehicle-logs', { findVehicleLogsInStore: 'find' } ),
      ...mapGetters('auth', [
        'user',
        'isAuthenticated'
      ]),
      organisations(){
        return this.findOrgsInStore({query: {}}).data
      },
      displayNoOrgsMsg(){
        console.log(this.organisations)
        let display = true
        if(this.organisations.length > 0){
          display = false
        }
        return display
      },
      vehicleLogList() {
        let logs = []
        if(this.currentOrganisation){
          logs = _.cloneDeep(this.findVehicleLogsInStore({
            query: {
              organisation_id: this.currentOrganisation._id,
              startTimestamp: {
                $gte: DateTime.fromISO(this.dates[0], {zone: 'utc'}).set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0}).toJSDate(),
                $lte: DateTime.fromISO(this.dates[1], {zone: 'utc'}).set({ hours: 23, minutes: 59, seconds: 59, milliseconds: 999}).toJSDate()
              }
            }
          }))

          if('data' in logs && logs.data.length > 0){
            logs = logs.data
          } else {
            logs = []
          }

          for(let l of logs){
            if('startTimestamp' in l){
              l.date = DateTime.fromJSDate(l.startTimestamp).toLocaleString(DateTime.DATE_FULL)
              l.time = DateTime.fromJSDate(l.startTimestamp).toLocaleString({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
            }
            if('type' in l){
              l.type = l.type.charAt(0).toUpperCase() + l.type.slice(1).toLowerCase();
            }
            if('location' in l){
              l.location = l.location.join(', ')
            }
          }
        }
        
        return logs
      }
    },
    async mounted(){
    }
  }

</script>