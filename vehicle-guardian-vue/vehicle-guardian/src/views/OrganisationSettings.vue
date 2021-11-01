<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols=2></v-col>
      <v-col>
        <v-card class="pa-6 ma-6">
          <v-card-title>
            Organisation Settings
          </v-card-title>
          <v-container>
            <v-row align="center">
              <v-col cols="6">
                <v-text-field
                  class="px-6"
                  v-if="!editingName"
                  v-model="currentOrganisation.name"
                  disabled
                  label="Name"
                  required
                  type="text"
                  color="primary"
                />
                <v-text-field
                  class="px-6"
                  v-else
                  v-model="newName"
                  ref="nameTextField"
                  label="Name"
                  :error-messages="nameErrors"
                  required
                  type="text"
                  color="accent'"
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
                  @click="updateName"
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
                  v-if="!editingEmail"
                  v-model="currentOrganisation.email"
                  disabled
                  label="Email"
                  required
                  type="text"
                  color="primary"
                />
                <v-text-field
                  class="px-6"
                  v-else
                  v-model="newEmail"
                  ref="emailTextField"
                  label="Email"
                  :error-messages="emailErrors"
                  required
                  type="text"
                  color="accent"
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
                  @click="updateEmail"
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
                <v-textarea
                  class="px-6"
                  rows="3"
                  row-height="15"
                  no-resize
                  v-if="!editingDescription"
                  v-model="currentOrganisation.description"
                  disabled
                  label="Description"
                  name="description"
                  color="primary"
                />
                <v-textarea
                  class="px-6"
                  rows="3"
                  row-height="15"
                  no-resize
                  v-model="newDescription"
                  v-else
                  ref="descriptionTextArea"
                  label="Description"
                  name="description"
                  color="accent"
                />
              </v-col>
              <v-col>
                <v-btn
                  v-if="!editingDescription"
                  bottom
                  text
                  color="accent"
                  @click="editDescription"
                >
                  edit
                </v-btn>
                <v-btn
                  v-if="editingDescription"
                  bottom
                  text
                  color="accent"
                  @click="updateDescription"
                >
                  save
                </v-btn>
                <v-btn
                  v-if="editingDescription"
                  bottom
                  text
                  color="accent"
                  @click="cancelEditDescription"
                >
                  cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          <v-card-title>
            Users
          </v-card-title>
          <v-container>
            <v-row>
              <v-col cols=8>
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                      <tr
                        v-for="item in currentOrganisation.users"
                        :key="item.name"
                      >
                        <td>
                          <v-avatar size="28" color="primary">
                            <v-icon dark>
                              mdi-account-circle
                            </v-icon>
                          </v-avatar>
                          {{ item.name }}
                        </td>
                        <td>{{ item.role }}</td>
                        <td class="text-end">
                          <v-btn
                          bottom
                          text
                          disabled
                          color="accent"
                          >
                            Edit
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
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
  import { mapActions, mapGetters, mapState } from "vuex";
  import { validationMixin } from 'vuelidate'
  import { required, email } from 'vuelidate/lib/validators'

  export default {
    name: "UserSettings",

    mixins: validationMixin,
    validations : {
      newName: { required },
      newEmail: { required, email }
    },
    data: () => ({
      newName: "",
      newEmail: "",
      newDescription: "",
      editingName: false,
      editingEmail: false,
      editingDescription: false,
    }),
    computed: {
      ...mapGetters('auth', [
        'user',
        'isAuthenticated'
      ]),
      ...mapState(['currentOrganisation']),
      nameErrors(){
        const errors = []
        if (!this.$v.newName.$dirty) return errors
        !this.$v.newName.required && errors.push('Name is required.')
        return errors
      },
      emailErrors(){
        const errors = []
        if(!this.$v.newEmail.$dirty) return errors
        !this.$v.newEmail.email && errors.push('E-mail must be valid')
        !this.$v.newEmail.required && errors.push('E-mail is required')
        return errors   
      },
    },
    methods: {
      ...mapActions("organisations", { patchOrganisation: "patch" }),
      updateName(){
        this.$v.newName.$touch()
        if(this.nameErrors.length == 0){
          this.patchOrganisation([
            this.currentOrganisation._id,
            {
              name: this.newName
            }
          ]).then(()=>{
            this.editingName = false
          }).catch((err)=>{
            console.log(err)
          })
        }
      },
      updateEmail(){
        this.$v.newEmail.$touch()
        if(this.emailErrors.length == 0){
          this.patchOrganisation([
            this.currentOrganisation._id,
            {
              email: this.newEmail
            }
          ]).then(()=>{
            this.editingEmail = false
          }).catch((err)=>{
            console.log(err)
          })
          this.$nextTick(() => { this.$v.$reset() })
        }
      },
      updateDescription(){
        this.patchOrganisation([
          this.currentOrganisation._id,
          {
            description: this.newDescription
          }
        ]).then(()=>{
          this.editingDescription = false
        }).catch((err)=>{
          console.log(err)
        })
        this.$nextTick(() => { this.$v.$reset() })
      },
      editName(){
        this.newName = this.currentOrganisation.name
        this.editingName = true
        setTimeout(() => {
          this.$refs.nameTextField.focus()
        }, 0)
      },
      editEmail(){
        this.newEmail = this.currentOrganisation.email
        this.editingEmail = true
        setTimeout(() => {
          this.$refs.emailTextField.focus()
        }, 0)
      },
      editDescription(){
        this.newDescription = this.currentOrganisation.description
        this.editingDescription = true
        setTimeout(() => {
          this.$refs.descriptionTextArea.focus()
        }, 0)
      },
      cancelEditName(){
        this.editingName = false
        this.newName = this.currentOrganisation.name
        this.$nextTick(() => { this.$v.$reset() })
      },
      cancelEditEmail(){
        this.editingEmail = false
        this.newEmail = this.currentOrganisation.email
        this.$nextTick(() => { this.$v.$reset() })
      },
      cancelEditDescription(){
        this.editingDescription = false
        this.newDescription = this.currentOrganisation.description
        this.$nextTick(() => { this.$v.$reset() })
      }
    },
    mounted() {
      this.newName = this.currentOrganisation.name
      this.newEmail = this.currentOrganisation.email
      this.newDescription = this.currentOrganisation.description
    }
  }
</script>