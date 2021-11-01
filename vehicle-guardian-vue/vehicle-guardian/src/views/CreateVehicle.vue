<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols=2></v-col>
      <v-col cols=8>
        <v-card class="pa-6 ma-6">
          <v-card-title>
            Create New Vehicle
          </v-card-title>

          <v-expansion-panels
            mandatory v-model="panel"
          >
            <v-expansion-panel>
              <v-expansion-panel-header>
                Via App
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="text-center">
                  <v-card-text class="text-subtitle-1">
                    Scan the QR Code with the CAV Guardian App
                  </v-card-text>
                  <qrcode-vue :value="qrcode.value" :size="qrcode.size" :level="qrcode.level" />
                  <v-card-text>
                    {{ this.organisationKey }}
                  </v-card-text>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                Manual Creation
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-form :disabled="formLoading">
                  <v-col cols=6>
                    <v-text-field
                      v-model="vehicleForm.registration"
                      label="Registration Number"
                      required
                      type="text"
                    />
                    <v-select
                      v-model="vehicleForm.type"
                      :items="vehicleTypes"
                      label="Type"
                    ></v-select>
                    <v-text-field
                      v-model="vehicleForm.colour"
                      label="Colour"
                      type="text"
                    />
                    <v-text-field
                      v-model="vehicleForm.systemId"
                      label="System ID"
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
                          This can be found printed on your CAV Guardian Server Box
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-card-actions class="mt-6">
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      :loading="formLoading"
                      @click="createVehicle"
                    >
                      Create Vehicle
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
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
  import QrcodeVue from 'qrcode.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      QrcodeVue,
    },
    data() {
      return {
        panel: 0,
        formLoading: false,
        alertState : false,
        alertMessage: '',
        alertColor: "error",
        vehicleTypes: [
          'Passenger Car',
          'Bus or Coach',
          'Light Goods Vehicle',
          'Heavy Goods Vehicle',
          'Industrial or Agricultrural',
          'Other'
        ],
        vehicleForm: {
          registration: '',
          type: '',
          colour: '',
          systemId: ''
        }
      }
    },
    computed: {
      ...mapState(['currentOrganisation']),
      qrcode() {
        return {
          value: this.organisationKey,
          size: 200,
          level: 'H'
        }
      },
      organisationKey() {
        return this.currentOrganisation._id + '-' + this.currentOrganisation.orgKeySecret
      }
    },
    methods: {
      async createVehicle() {
        this.formLoading = true
        console.log('Creating Vehicle')

        const { Vehicle } = this.$FeathersVuex.api
        const vehicle = new Vehicle({
          organisation_id: this.currentOrganisation._id,
          ...this.vehicleForm
        })

        vehicle.create().then(()=>{
          this.alertMessage = "Vehicle Created!"
          this.alertColor = "info"
          this.alertState = true
          setTimeout(() => {
            this.$router.push({ path: "/vehicles" });
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