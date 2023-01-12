<template>
  <v-container>
    <v-form
      ref="form"
      v-model="valid">
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="4"
        >
          <v-menu
            ref="menu"
            v-model="startMenu"
            :close-on-content-click="false"
            :return-value.sync="startDate"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="startDate"
                label="Start Date (Inclusive)"
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="endDate"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="startMenu = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.startMenu.save(startDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-spacer></v-spacer>
        <v-col
          cols="12"
          sm="6"
          md="4"
        >
          <v-menu
            ref="menu"
            v-model="endMenu"
            :close-on-content-click="false"
            :return-value.sync="endDate"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="endDate"
                label="End Date (Inclusive)"
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="endDate"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="endMenu = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.endMenu.save(endDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-checkbox
            v-model="allFramesSelected"
            :label="'All Frames'">
          </v-checkbox>
        </v-col>
        <v-col>
          <v-checkbox
            v-model="missingFramesSelected"
            :label="'Missing Frames'"
            :disabled="allFramesSelected">
          </v-checkbox>
        </v-col>
        <v-col>
          <v-checkbox
            v-model="badWcsSelected"
            :label="'Bad WCS'"
            :disabled="allFramesSelected">
          </v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="submit"
    >
      Submit
    </v-btn>

    <v-btn
      color="error"
      class="mr-4"
      @click="reset"
    >
      Reset Form
    </v-btn>
      </v-row>

      
    </v-form>
  </v-container>
  </template>
  
  <script>
  
    export default {
      name: 'ReprocessPane',
      props: {
      },
      data() {
        return {
          startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          endDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
          startMenu: false,
          endMenu: false,
          allFramesSelected: false,
          missingFramesSelected: false,
          badWcsSelected: false,
          valid: false
        }
      },
      computed: {
      },
      mounted() {
      },
      methods: {
        submit () {
          this.$refs.form.validate()
        },
        reset () {
          this.$refs.form.reset()
        },
      }
    }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style>
  
  </style>
  