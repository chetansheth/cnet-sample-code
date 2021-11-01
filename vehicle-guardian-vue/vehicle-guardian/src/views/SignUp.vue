<template>
  <v-container fill-height fluid>
    <v-row align="center">
      <v-col>
        <v-card class="pb-5 mx-auto" max-width="700">
          <v-container>
            <v-row>
              <v-col cols=7>
                <v-card-title class="pb-0"> Sign Up </v-card-title>
                <v-form v-model="valid" @submit="submit" id="signup-form">
                  <v-text-field
                    class="px-6"
                    v-model="name"
                    label="Display Name"
                    :error-messages="nameErrors"
                    required
                    prepend-icon="mdi-account"
                    type="text"
                  />
                  <v-text-field
                    class="px-6"
                    v-model="email"
                    label="Email"
                    :error-messages="emailErrors"
                    required
                    prepend-icon="mdi-email"
                    type="text"
                  />
                  <v-text-field
                    class="px-6"
                    v-model="password"
                    label="Password"
                    name="password"
                    :error-messages="passwordErrors"
                    required
                    prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                  />
                  <v-text-field
                    class="px-6"
                    v-model="repeatPassword"
                    label="Confirm Password"
                    name="repeatPassword"
                    :error-messages="repeatPasswordErrors"
                    required
                    prepend-icon="mdi-lock"
                    :append-icon="showRepeatPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showRepeatPassword ? 'text' : 'password'"
                    @click:append="showRepeatPassword = !showRepeatPassword"
                  />
                </v-form>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="primary"
                    id="btn_signup"
                    form="signup-form"
                    @click="submit"
                    >Sign Up</v-btn
                  >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    to="/"
                    >Cancel</v-btn
                  >
                  <v-spacer />
                </v-card-actions>
              </v-col>
              <v-col cols=5>
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
import { mapState } from "vuex"
import { validationMixin } from 'vuelidate'
import { required, email, sameAs } from 'vuelidate/lib/validators'

export default {
  name: "SignUp",

  mixins: validationMixin,
  validations : {
      name: { required },
      email: { required, email },
      password: { required },
      repeatPassword:{
          required,
          sameAsPassword : sameAs('password')
      }
  },
  data: () => ({
    showPassword: false,
    showRepeatPassword: false,
    password: "",
    repeatPassword: "",
    name: "",
    email: "",
    success: false,
    valid:false,
    alertState : false,
    alertMessage: '',
    alertColor: "error"
  }),
  computed: {
    ...mapState("users", { loading: "isCreatePending" }),
    nameErrors(){
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Name is required.')
      return errors
    },
    emailErrors(){
      const errors = []
      if(!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('E-mail must be valid')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors   
    },
    passwordErrors (){
      const errors = []
      if(!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Password is required')
      return errors
    },
    repeatPasswordErrors (){
      const errors = []
      if(!this.$v.repeatPassword.$dirty) return errors
      !this.$v.repeatPassword.required && errors.push('Password confirmation is required')
      !this.$v.repeatPassword.sameAsPassword && errors.push('Password confirmation must be identical to Password')
      return errors
    }
  },
  methods: {
    submit() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        const { User } = this.$FeathersVuex.api
        const user = new User({
          email: this.email,
          name: this.name,
          password: this.password
        })

        user.create({
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            localStorage.setItem('userId',res.__id)
            this.success = true
            this.alertMessage = "Successfully signed up!"
            this.alertColor = "info"
            this.alertState = true
            setTimeout(() => {
              this.$router.push({ path: "/login" });
            }, 1000)
        }).catch(err => {
          console.log(err);
            this.alertState = true
            if(err.code == 403){
              this.alertMessage = "Email already exists!"
            }else{
              this.alertMessage = "Error in registration. Please try again!"
            }
            setTimeout(() => {
              this.alertState = false
            }, 3000)
        })
      }
      
    }
  }
}





</script>
