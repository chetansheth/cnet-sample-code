<template>
  <v-container fill-height fluid>
    <v-row align="center">
      <v-col>
        <v-card class="pb-5 mx-auto" max-width="700">
          <v-container>
            <v-row>
              <v-col cols="7">
                <v-card-title class="pb-0"> Login </v-card-title>
                <div>
                  <div class="d-inline-flex align-center">
                    <v-card-subtitle> Don't have an account? </v-card-subtitle>
                  </div>
                  <div class="d-inline-flex align-center">
                    <v-btn
                      text
                      plain
                      class="px-0 text-none"
                      color="accent"
                      to="/signup"
                    >
                      Sign Up
                    </v-btn>
                  </div>
                </div>
                <v-form @submit="submit" id="login-form">
                  <v-text-field
                    class="px-6"
                    v-model="email"
                    label="email"
                    required
                    prepend-icon="mdi-account"
                    type="text"
                  />
                  <v-text-field
                    class="px-6"
                    v-model="password"
                    label="Password"
                    name="password"
                    required
                    prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                    @keyup.enter="submit"
                  />
                </v-form>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="primary"
                    id="btn_signin"
                    form="login-form"
                    @click="submit"
                    >Login</v-btn
                  >
                  <v-spacer />
                </v-card-actions>
              </v-col>
              <v-col cols="5">
                <v-card height=100% color=grey></v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-none d-md-flex align-center justify-center">
        <v-alert
          :value="error"
          transition="scale-transition"
          color="error"
          dark
          dismissible
        >
          {{ errorMessage }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "Login",

  data: () => ({
    showPassword: false,
    password: "",
    email: "",
    success: false,
    error: false,
    errorMessage: "",
  }),

  computed: {
    ...mapState("auth", { loading: "isAuthenticatePending" }),
  },

  methods: {
    ...mapActions("auth", ["authenticate"]),
    ...mapActions("organisations", { findOrganisations: "find" }),
    ...mapMutations(["setCurrentOrganisation"]),
    submit() {
      this.authenticate({
        strategy: "local",
        email: this.email,
        password: this.password,
      }).then((res) => {
        localStorage.setItem("accessToken", res.accessToken);
        // this.findOrganisations({ query: {} }).then((res) => {
        //   if(res.total > 0){
        //     this.setCurrentOrganisation(res.data[0])
        //   }
        // });
        this.success = true;
        this.$router.push({ path: "/dashboard" });
      })
      .catch((err) => {
        this.error = true;
        if (err.code == 401) {
          this.errorMessage = "Invalid login. Please try again!";
        } else if (err.code == 400) {
          this.errorMessage = "User not verified!";
        } else {
          this.errorMessage = "Error in login. Please try again!";
        }
        setTimeout(() => {
          this.error = false;
        }, 2000);
      });
    },
  },
};
</script>