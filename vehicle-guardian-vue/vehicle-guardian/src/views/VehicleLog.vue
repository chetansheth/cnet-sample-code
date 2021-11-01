<template>
  <v-container class="pa-8">
    <v-row>
      <v-col cols=4>
        <v-card>
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
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Audit Log
            <v-spacer/>
            <v-btn
                color="accent"
                @click="updateVehicleLogs"
            >
              Refresh
            </v-btn>
          </v-card-title>
          <v-row>
            <v-col cols=4>
              <v-menu
                v-model="datePickerMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    class="mx-8"
                    v-model="dateRangeText"
                    label="Date range"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="datePickerDates"
                  no-title
                  range
                  @change="updateVehicleLogs"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-row justify="center">
                <v-col cols=11>
                  <v-data-table
                    class="px-0"
                    :headers="logTableHeaders"
                    :items="vehicleLogList"
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
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { DateTime } from "luxon"
  import _ from "lodash"

  export default {
    data(){
      return{
        vehicle_id: this.$route.params.vehicle_id,
        datePickerMenu: false,
        datePickerDates: [null, null],
        dates: [null, null],
        logTableHeaders: [
          {
            text: "Date",
            align: "start",
            value: "date"
          },
          {
            text: "Time (UTC)",
            value: "time"
          },
          {
            text: "Type",
            value: "type"
          },
          {
            text: "Location",
            value: "location"
          },
          {
            text: "Actions",
            sortable: false,
            value: 'actions'
          }
        ],
      }
    },
    computed: {
      ...mapGetters('vehicles', { getVehicleFromStore: 'get' } ),
      ...mapGetters('vehicle-logs', { findVehicleLogsInStore: 'find' } ),
      vehicle(){
        return this.getVehicleFromStore(this.vehicle_id)
      },
      dateRangeText () {
        return this.dates.join('  to  ')
      },
      vehicleLogList() {

        let logs = _.cloneDeep(this.findVehicleLogsInStore({
          query: {
            vehicle_id: this.vehicle_id,
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

        return logs
      }
    },
    methods:{
      ...mapActions('vehicles', { getVehicle: 'get' }),
      ...mapActions('vehicle-logs', { findVehicleLogs: 'find' }),
      viewIncident(item){
        this.$router.push({ name: 'Incident', params: { vehicle_id: this.vehicle_id, log_id: item._id.toString() }})
      },
      async updateVehicleLogs(){
        this.dates = this.datePickerDates
        await this.findVehicleLogs({
          query: {
            vehicle_id: this.vehicle_id,
            startTimestamp: this.dates[0],
            endTimestamp: this.dates[1]
          }
        })
      }
    },
    async mounted(){
      this.getVehicle(this.vehicle_id)
      let today = DateTime.now().toISODate()
      this.datePickerDates = [today, today]
      this.dates = [today, today]
      await this.updateVehicleLogs()
    }
  }
</script>