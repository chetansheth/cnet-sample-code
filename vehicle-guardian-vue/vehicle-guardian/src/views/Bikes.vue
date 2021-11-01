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
            Bike List
            <v-spacer/>
            <v-btn
                color="accent"
                to="/create-bike"
            >
              Add Bike
            </v-btn>
          </v-card-title>
          <v-row justify="center">
            <v-col cols=11>
              <v-data-table
                class="px-0"
                :headers="bikeTableHeaders"
                :items="bikesList"
                :search="bikeSearch"
              ></v-data-table>
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
        bikeSearch: "",
        bikeTableHeaders: [
          {
            text: "Serial Number",
            align: "start",
            sortable: false,
            value: "serialNumber"
          },
          {
            text: "Description",
            value: "description"
          },
          {
            text: "Tracker ID",
            sortable: false,
            value: "trackerId"
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
      ...mapActions('bikes', { findBikes: 'find' })
    },
    computed: {
      ...mapState(['currentOrganisation']),
      ...mapGetters('bikes', { findBikesInStore: 'find' } ),
      bikesList(){
        console.log(this.findBikesInStore())
        this.findBikes({query: {
          organisation_id: this.currentOrganisation._id
        }})
        return this.findBikesInStore({query: {
          organisation_id: this.currentOrganisation._id
        }}).data
      },
      nLicensesInUse(){
        return this.currentOrganisation.nBikesInUse
      },
      totalLiceses(){
        return this.currentOrganisation.subscription.nBikeLicenses
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
      this.findBikes({query: {
        organisation_id: this.currentOrganisation._id
      }})
    }
  }
</script>