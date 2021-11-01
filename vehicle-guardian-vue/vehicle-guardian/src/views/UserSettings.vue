<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols=2></v-col>
      <v-col>
        <v-card class="pa-6 ma-6">
          <v-card-title>
            User Settings
          </v-card-title>
          <v-container>
            <v-row align="center">
              <v-col cols="6">
                <v-text-field
                  class="px-6"
                  v-model="name"
                  ref="nameTextField"
                  :disabled="!editingName"
                  label="Display Name"
                  :error-messages="nameErrors"
                  required
                  prepend-icon="mdi-account"
                  type="text"
                  :color="editingName ? 'accent' : 'primary'"
                />
              </v-col>
              <v-col>
                <v-btn
                  v-if="!editingName"
                  bottom
                  text
                  color="accent"
                  @click="editName"
                >
                  edit
                </v-btn>
                <v-btn
                  v-if="editingName"
                  bottom
                  text
                  color="accent"
                  @click="updateUserName"
                >
                  save
                </v-btn>
                <v-btn
                  v-if="editingName"
                  bottom
                  text
                  color="accent"
                  @click="cancelEditName"
                >
                  cancel
                </v-btn>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="6">
                <v-text-field
                  class="px-6"
                  v-model="email"
                  ref="emailTextField"
                  :disabled="!editingEmail"
                  label="Email"
                  :error-messages="emailErrors"
                  required
                  prepend-icon="mdi-email"
                  type="text"
                  :color="editingEmail ? 'accent' : 'primary'"
                />
              </v-col>
              <v-col>
                <v-btn
                  v-if="!editingEmail"
                  bottom
                  text
                  color="accent"
                  @click="editEmail"
                >
                  edit
                </v-btn>
                <v-btn
                  v-if="editingEmail"
                  bottom
                  text
                  color="accent"
                  @click="updateUserEmail"
                >
                  save
                </v-btn>
                <v-btn
                  v-if="editingEmail"
                  bottom
                  text
                  color="accent"
                  @click="cancelEditEmail"
                >
                  cancel
                </v-btn>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="6">
                <v-text-field
                  class="px-6"
                  v-model="password"
                  ref="passwordTextField"
                  :disabled="!editingPassword"
                  label="Password"
                  name="password"
                  :error-messages="passwordErrors"
                  required
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  :color="editingPassword ? 'accent' : 'primary'"
                />
              </v-col>
              <v-col>
                <v-btn
                  v-if="!editingPassword"
                  bottom
                  text
                  color="accent"
                  @click="editPassword"
                >
                  edit
                </v-btn>
                <v-btn
                  v-if="editingPassword"
                  bottom
                  text
                  color="accent"
                  @click="updateUserPassword"
                >
                  save
                </v-btn>
                <v-btn
                  v-if="editingPassword"
                  bottom
                  text
                  color="accent"
                  @click="cancelEditPassword"
                >
                  cancel
                </v-btn>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col cols="6">
                <v-text-field
                  v-if="editingPassword"
                  class="px-6"
                  v-model="confirmPassword"
                  ref="confirmPasswordTextField"
                  :disabled="!editingPassword"
                  label="Confirm Password"
                  name="confirmPassword"
                  :error-messages="confirmPasswordErrors"
                  required
                  prepend-icon="mdi-lock"
                  :append-icon="showconfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showconfirmPassword ? 'text' : 'password'"
                  @click:append="showconfirmPassword = !showconfirmPassword"
                  :color="editingPassword ? 'accent' : 'primary'"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols=2></v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from "vuex";
  import { validationMixin } from 'vuelidate'
  import { required, email, sameAs } from 'vuelidate/lib/validators'

  export default {
    name: "UserSettings",

    mixins: validationMixin,
    validations : {
      name: { required },
      email: { required, email },
      password: { required },
      confirmPassword:{
          required,
          sameAsPassword : sameAs('password')
      }
    },
    data: () => ({
      name: "",
      email: "",
      password: "P4$$w0rd101!",
      confirmPassword: "",
      editingName: false,
      editingEmail: false,
      editingPassword: false,
      showPassword: false,
      showconfirmPassword: false,
    }),
    methods: {
      ...mapActions("users", { patchUser: "patch" }),
      updateUserName(){
        this.$v.name.$touch()
        if(this.nameErrors.length == 0){
          this.patchUser([
            this.user._id,
            {
              name: this.name
            }
          ]).then(()=>{
            this.name = this.user.name
            this.editingName = false
          }).catch((err)=>{
            console.log(err)
          })
        }
      },
      updateUserEmail(){
        this.$v.email.$touch()
        if(this.emailErrors.length == 0){
          this.patchUser([
            this.user._id,
            {
              email: this.email
            }
          ]).then(()=>{
            this.email = this.user.email
            this.editingEmail = false
          }).catch((err)=>{
            console.log(err)
          })
          this.$nextTick(() => { this.$v.$reset() })
        }
      },
      updateUserPassword(){
        this.$v.password.$touch()
        this.$v.confirmPassword.$touch()
        if((this.passwordErrors.length + this.confirmPasswordErrors.length) == 0){
          this.patchUser([this.user._id, {
            password: this.password
          }]).then(()=>{
            this.password = "P4$$w0rd101!"
            this.confirmPassword = ""
            this.editingPassword = false
          }).catch((err)=>{
            console.log(err)
          })
          this.$nextTick(() => { this.$v.$reset() })
        }
      },
      editName(){
        this.editingName = true
        setTimeout(() => {
          this.$refs.nameTextField.focus()
        }, 0)
      },
      editEmail(){
        this.editingEmail = true
        setTimeout(() => {
          this.$refs.emailTextField.focus()
        }, 0)
      },
      editPassword(){
        this.password = ""
        this.editingPassword = true
        setTimeout(() => {
          this.$refs.passwordTextField.focus()
        }, 0)
      },
      cancelEditName(){
        this.editingName = false
        this.name = this.user.name
        this.$nextTick(() => { this.$v.$reset() })
      },
      cancelEditEmail(){
        this.editingEmail = false
        this.email = this.user.email
        this.$nextTick(() => { this.$v.$reset() })
      },
      cancelEditPassword(){
        this.editingPassword = false
        this.password = "P4$$w0rd101!"
        this.confirmPassword = ""
        this.$nextTick(() => { this.$v.$reset() })
      }
    },
    computed: {
      ...mapGetters('auth', [
        'user',
        'isAuthenticated'
      ]),
      
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
      confirmPasswordErrors (){
        const errors = []
        if(!this.$v.confirmPassword.$dirty) return errors
        !this.$v.confirmPassword.required && errors.push('Password confirmation is required')
        !this.$v.confirmPassword.sameAsPassword && errors.push('Password confirmation must be identical to Password')
        return errors
      }
    },
    mounted() {
      this.name = this.user.name
      this.email = this.user.email
    }
  }
</script>