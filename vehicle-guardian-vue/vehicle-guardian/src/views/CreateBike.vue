<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols=2></v-col>
      <v-col cols=8>
        <v-card class="pa-6 ma-6">
          <v-card-title>
            Create New Bike
          </v-card-title>
          <v-form :disabled="formLoading">
            <v-col cols=6>
              <v-text-field
                v-model="bikeForm.serialNumber"
                label="Serial Number"
                required
                type="text"
              />
              <v-text-field
                v-model="bikeForm.description"
                label="Description"
                type="text"
              />
              <v-text-field
                v-model="bikeForm.trackerId"
                label="Tracker ID"
                required
                type="text"
              >
                <template v-slot:append>
                  <v-tooltip
                    bottom
                  >
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        mdi-help-circle-outline
                      </v-icon>
                    </template>
                    This can be found printed on your CAV Bike Tracker
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
            <v-card-actions class="mt-6">
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                :loading="formLoading"
                @click="createBike"
              >
                Create Bike
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-none d-md-flex align-center justify-center">
        <v-alert
          :value="alertState"
          transition="scale-transition"
          :color="alertColor"
          dark
          dismissible
        >
          {{ alertMessage }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        formLoading: false,
        alertState : false,
        alertMessage: '',
        alertColor: "error",
        bikeForm: {
          serialNumber: '',
          description: '',
          trackerId: ''
        }
      }
    },
    computed: {
      ...mapState(['currentOrganisation']),
    },
    methods: {
      async createBike(){
        this.formLoading = true
        console.log('Creating Bike')

        const { Bike } = this.$FeathersVuex.api
        const bike = new Bike({
          organisation_id: this.currentOrganisation._id,
          ...this.bikeForm
        })

        bike.create().then(()=>{
          this.alertMessage = "Bike Created!"
          this.alertColor = "info"
          this.alertState = true
          setTimeout(() => {
            this.$router.push({ path: "/bikes" });
          }, 1000)
        }).catch(err => {
          this.alertState = true
          this.alertMessage = err.message
          setTimeout(() => {
            this.alertState = false
            this.formLoading = false
          }, 3000)
          
        })
      }
    }
  }

</script>
