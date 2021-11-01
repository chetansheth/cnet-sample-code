<template>
  <v-container class="pa-8">
     <v-row>
      <v-col cols=3>
        <v-card height="100%">
          <v-card-title>
            Vehicle
          </v-card-title>
          <v-card-text class="">
            Registration: {{vehicle.registration}} <br>
            Type: {{vehicle.type}} <br>
            Colour: {{vehicle.colour}}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols=3>
        <v-card height="100%">
          <v-card-title>
            Incident
          </v-card-title>
          <v-card-text class="">
            Type: {{incident.type}} <br>
            Date: {{incident.date}} <br>
            Time: {{incident.time}} UTC <br>
            Bike ID: {{incident.bikeId}} <br>
            Bike ID Source: {{incident.bikeIdSrc}} <br>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols=6>
        <v-card height="100%">
          <v-card-title>
            Telemetry
          </v-card-title>
          <v-card-text>
            {{telemetry}}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols=6>
        <v-card height="100%">
          <v-card-title>
            Location
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
              <l-marker
                :lat-lng="mapCenter"
              ></l-marker>
            </l-map>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { DateTime } from "luxon"
  import _ from "lodash"
  import { latLng } from "leaflet";
  import { LMap, LTileLayer, LMarker } from "vue2-leaflet";

  export default {
    components: {
      LMap,
      LTileLayer,
      LMarker
    },
    data(){
      return {
        vehicle_id: this.$route.params.vehicle_id,
        log_id: this.$route.params.log_id,
        mapZoom:14,
        mapOptions: {},
        mapUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        mapAttribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        telemetry: {},
      }
    },
    computed: {
      ...mapGetters('vehicles', { getVehicleFromStore: 'get' } ),
      ...mapGetters('vehicle-logs', { getVehicleLogsInStore: 'get' } ),
      mapCenter() {
        return latLng(this.incident.location)
      },
      vehicle(){
        return this.getVehicleFromStore(this.vehicle_id)
      },
      incident(){
        let incident = _.cloneDeep(this.getVehicleLogsInStore(this.log_id))

        if('startTimestamp' in incident){
          incident.date = DateTime.fromJSDate(incident.startTimestamp).toLocaleString(DateTime.DATE_FULL)
          incident.time = DateTime.fromJSDate(incident.startTimestamp).toLocaleString({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
        }
        if('type' in incident){
          incident.type = incident.type.charAt(0).toUpperCase() + incident.type.slice(1).toLowerCase();
        }

        return incident
      },
      
    },
    methods: {
      ...mapActions('vehicle-telemetry', { getTelemetry: 'find' }),
    },
    async mounted() {
      this.telemetry = await this.getTelemetry({
          query: {
            vehicle_id: this.vehicle_id,
            startTimestamp: DateTime.fromJSDate(this.incident.startTimestamp).toISO(),
            endTimestamp: DateTime.fromJSDate(this.incident.startTimestamp).toISO()} })
    }
  }
</script>