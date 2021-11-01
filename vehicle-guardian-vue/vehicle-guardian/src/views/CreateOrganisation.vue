<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="2"></v-col>
      <v-col cols="8">
        <v-card class="pa-6 ma-6">
          <v-stepper non-linear flat v-model="stepperModel">
            <v-stepper-header>
              <v-stepper-step
                color="accent"
                :complete="stepperModel > 1"
                step="1"
              >
                Organisation
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step
                color="accent"
                :complete="stepperModel > 2"
                step="2"
              >
                Invite Users
                <small>Optional</small>
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step color="accent" step="3">
                Subscription
                <small>Optional</small>
              </v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card>
                  <v-card-title> Organisation Details </v-card-title>
                  <v-form :disabled="formLoading" id="orgDetails">
                    <div class="px-6">
                      <v-text-field
                        v-model="orgForm.name"
                        label="Organisation Name"
                        required
                        type="text"
                      />
                      <v-text-field
                        v-model="orgForm.email"
                        label="Organisation Email"
                        required
                        type="text"
                      />
                      <v-textarea
                        v-model="orgForm.description"
                        label="Description"
                        rows="3"
                        row-height="15"
                        no-resize
                      ></v-textarea>
                    </div>
                    <v-card-actions class="mt-6">
                      <v-btn
                        color="primary"
                        text
                        form="orgDetails"
                        @click="cancel"
                      >
                        Cancel
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        :loading="formLoading"
                        @click="createOrg"
                      >
                        Create Organisation
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card>
                  <v-card-title> Invite Users </v-card-title>
                  <v-form :disabled="formLoading" id="orgUsers">
                    <v-container class="px-6">
                      <v-row v-for="(user, idx) in orgForm.users" :key="idx">
                        <v-col cols="4">
                          <v-text-field
                            v-model="user.email"
                            append-icon="mdi-email"
                            label="Email"
                            required
                          >
                          </v-text-field>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="6">
                          <v-radio-group v-model="user.role" row>
                            <v-row>
                              <v-col cols="6">
                                <v-radio
                                  color="accent"
                                  label="Admin"
                                  value="admin"
                                ></v-radio>
                              </v-col>
                              <v-col cols="6">
                                <v-radio
                                  color="accent"
                                  label="Manager"
                                  value="manager"
                                ></v-radio>
                              </v-col>
                            </v-row>
                          </v-radio-group>
                        </v-col>
                        <v-col>
                          <v-btn fab icon @click="removeUser(idx)">
                            <v-icon color="red"> mdi-close </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-btn
                          fab
                          small
                          @click="addUserInputLine"
                          color="accent"
                        >
                          <v-icon dark> mdi-plus </v-icon>
                        </v-btn>
                      </v-row>
                    </v-container>
                    <v-card-actions class="mt-6">
                      <v-btn color="primary" text @click="skipAddUsers">
                        Skip
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        form="orgUsers"
                        :loading="formLoading"
                        @click="addUsers"
                      >
                        Add Users
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-card>
                  <v-card-title> Subscription </v-card-title>
                  <v-form :disabled="formLoading" id="orgBilling">
                    <v-subheader>Number of Vehicle Licenses</v-subheader>
                    <v-container class="px-6">
                      <v-row>
                        <v-col cols="6">
                          <v-slider
                            v-model.number="
                              orgForm.subscription.requestedVehicleLicenses
                            "
                            step="10"
                            min="10"
                            max="50"
                            thumb-label="always"
                            thumb-color="accent"
                            class="mt-8"
                          >
                          </v-slider>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="5">
                          <v-text-field
                            v-model="vehicleCostPerMonthFormatted"
                            suffix="per month"
                            readonly
                            type="text"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>

                    <v-subheader>Number of Bike Licenses</v-subheader>
                    <v-container class="px-6">
                      <v-row>
                        <v-col cols="6">
                          <v-slider
                            v-model.number="
                              orgForm.subscription.requestedBikeLicenses
                            "
                            step="1"
                            min="0"
                            max="50"
                            thumb-label="always"
                            thumb-color="accent"
                            class="mt-8"
                          >
                          </v-slider>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="5">
                          <v-text-field
                            v-model="bikeCostPerMonthFormatted"
                            suffix="per month"
                            readonly
                            type="text"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>

                    <v-subheader>Card</v-subheader>
                    <v-container class="px-6">
                      <v-row>
                        <v-col>
                          <StripeElements
                            :stripe-key="stripeKey"
                            :instance-options="instanceOptions"
                            :elements-options="elementsOptions"
                            #default="{ elements }"
                            ref="elms"
                          >
                            <StripeElement
                              type="card"
                              :elements="elements"
                              :options="cardOptions"
                              ref="card"
                            />
                          </StripeElements>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-subheader>Billing Address</v-subheader>
                    <v-container class="px-">
                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            dense
                            clearable
                            label="Cardholder Name"
                            v-model="orgForm.subscription.cardHolder"
                            required
                            :error-messages="cardNameErrors"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                            dense
                            clearable
                            label="Address Line 1"
                            v-model="orgForm.subscription.address.line1"
                            required
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                            dense
                            clearable
                            label="Address Line 2"
                            v-model="orgForm.subscription.address.line2"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="8">
                          <v-text-field
                            dense
                            label="Town / City"
                            v-model="orgForm.subscription.address.city"
                            required
                          >
                          </v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                            dense
                            clearable
                            label="Post Code / Zip"
                            v-model="orgForm.subscription.address.postal_code"
                            required
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                            dense
                            clearable
                            label="State / Province / Region"
                            v-model="orgForm.subscription.address.state"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-select
                            dense
                            label="Country"
                            :items="countries"
                            item-text="country"
                            item-value="iso2"
                            v-model="orgForm.subscription.address.country"
                          >
                          </v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-card-actions class="mt-6">
                      <v-dialog
                        v-model="showSkipBillingDialog"
                        persistent
                        max-width="400"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn color="primary" text v-bind="attrs" v-on="on">
                            Skip
                          </v-btn>
                        </template>
                        <v-card>
                          <v-card-title>
                            Really Skip Subscription?
                          </v-card-title>
                          <v-card-text
                            >If you don't add billing information you won't be
                            able to set up CAV Vehicle Systems</v-card-text
                          >
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text @click="showSkipBillingDialog = false">
                              Back
                            </v-btn>
                            <v-btn text @click="skipOrgBilling">
                              I'm Sure
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>

                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        form="orgBilling"
                        :loading="formLoading"
                        @click="setOrgBilling"
                      >
                        Start Subscription
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card>
      </v-col>
      <v-col cols="2"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { StripeElements, StripeElement } from "vue-stripe-elements-plus";
import countryLookup from "country-code-lookup";

export default {
  components: {
    StripeElements,
    StripeElement,
  },
  data() {
    return {
      countries: countryLookup.countries,
      stripeKey:
        "pk_test_51JIalEBgQfQbb4ZpxHuBsNi3vlLaw5cAIhyMOn52xR0oi4ZAcb8BgWfD1B4GD5mJRNfYStxww4Ql9KS6ahOaW1QE00jPGg5ATm",
      instanceOptions: {
        // https://stripe.com/docs/js/initializing#init_stripe_js-options
      },
      elementsOptions: {
        // https://stripe.com/docs/js/elements_object/create#stripe_elements-options
      },
      cardOptions: {
        // reactive
        // remember about Vue 2 reactivity limitations when dealing with options
        // https://stripe.com/docs/stripe.js#element-options
        hidePostalCode: true,
        style: {
          base: {
            fontSize: "18px",
          },
        },
      },
      vehicleCostPerLicense: 4.95,
      bikeCostPerLicense: 6.99,
      stepperModel: 1,
      paymentToken: null,
      showSkipBillingDialog: false,
      formLoading: false,
      orgForm: {
        name: "",
        email: "",
        description: "",
        subscription: {
          requestedVehicleLicenses: 0,
          requestedBikeLicenses: 0,
          cardHolder: "",
          address: {
            line1: "",
            line2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "",
          },
        },
        users: [
          {
            email: "",
            role: "admin",
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions("organisations", { patchOrganisation: "patch" }),
    ...mapMutations(["setCurrentOrganisation"]),
    cancel() {
      this.$router.push({ path: "/dashboard" });
    },
    setOrgDetails() {
      this.stepperModel = 2;
    },
    async setOrgBilling() {
      this.formLoading = true;

      // Send subscription info to backend and wait for client secret
      console.log("Waiting for Backend");

      const { Subscription } = this.$FeathersVuex.api;

      const subscription = new Subscription({
        organisation_id: this.currentOrganisation._id,
        vehiclesQuantity: this.orgForm.subscription.requestedVehicleLicenses,
        bikesQuantity: this.orgForm.subscription.requestedBikeLicenses,
      });

      const subscriptionResponse = await subscription.create({
        headers: { "Content-Type": "application/json" },
      });

      console.log("Client Secret Recieved");
      console.log(subscriptionResponse);

      console.log("Waiting for Stripe");
      const groupComponent = this.$refs.elms;
      const cardComponent = this.$refs.card;
      const cardElement = cardComponent.stripeElement;

      const billingResult = await groupComponent.instance.confirmCardPayment(
        subscriptionResponse.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: this.orgForm.subscription.cardHolder,
              address: this.orgForm.subscription.address,
            },
          },
        }
      );

      console.log("Billing Result");
      console.log(billingResult);

      this.formLoading = false;

      this.$router.push({ path: "/dashboard" });
    },
    skipAddUsers() {
      this.stepperModel = 3;
    },
    skipOrgBilling() {
      this.$router.push({ path: "/dashboard" });
    },
    async addUsers() {
      this.formLoading = true;

      let patchResult;
      try {
        patchResult = await this.patchOrganisation([
          this.currentOrganisation._id,
          {
            users: this.orgForm.users,
          },
        ]);
      } catch (err) {
        console.log(err);
      }

      console.log("Users Added");
      console.log(patchResult);
      this.stepperModel = 3;

      this.formLoading = false;
    },
    addUserInputLine() {
      this.orgForm.users.push({
        userEmail: "",
        role: "admin",
      });
    },
    removeUser(idx) {
      this.orgForm.users.splice(idx, 1);
    },
    createOrg() {
      this.formLoading = true;

      const { Organisation } = this.$FeathersVuex.api;

      const organisation = new Organisation({
        name: this.orgForm.name,
        email: this.orgForm.email,
        description: this.orgForm.description,
      });

      organisation
        .create({
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          this.setCurrentOrganisation(res);
          console.log(res);
          this.stepperModel = 2;
        })
        .catch((err) => {
          console.log(err);
        });

      this.formLoading = false;
    },
  },
  computed: {
    ...mapState(["currentOrganisation"]),
    vehicleCostPerMonth() {
      return (
        this.orgForm.subscription.requestedVehicleLicenses *
        this.vehicleCostPerLicense
      );
    },
    bikeCostPerMonth() {
      return (
        this.orgForm.subscription.requestedBikeLicenses *
        this.bikeCostPerLicense
      );
    },
    vehicleCostPerMonthFormatted() {
      return Intl.NumberFormat("en-UK", {
        style: "currency",
        currency: "GBP",
      }).format(this.vehicleCostPerMonth);
    },
    bikeCostPerMonthFormatted() {
      return Intl.NumberFormat("en-UK", {
        style: "currency",
        currency: "GBP",
      }).format(this.bikeCostPerMonth);
    },
    cardNameErrors() {
      return [];
    },
    // cardNumberErrors() {
    //   return []
    // },
    // cardDateErrors(){
    //   return []
    // },
    // cardSecurityErrors(){
    //   return []
    // },
  },
};
</script>

<style scoped>
.card {
  background-color: 1px solid green;
}
</style>