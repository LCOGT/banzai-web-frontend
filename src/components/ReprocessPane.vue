<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col
          cols="6"
        >
          <v-date-picker
            v-model="dates"
            range>
          </v-date-picker>
        </v-col>
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
          dates: []
        }
      },
      computed: {
      },
      mounted() {
      },
      methods: {
      }
    }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style>
  
  </style>
  