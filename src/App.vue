<template>
  <v-app>
    <v-app-bar
      app
      color="purple"
      dark
    >
      <v-toolbar-title>BANZAI-Web Tools</v-toolbar-title>
    <v-spacer></v-spacer>
    </v-app-bar>

    TODO: Add a component for selecting instrument here
    <v-main>
      <MainWindow></MainWindow>
    </v-main>
  </v-app>
</template>

<script>
import MainWindow from '@/components/MainWindow.vue'

export default {
  name: 'App',
  components: {
    MainWindow
  },
  data: () => ({
    //
  }),
};
</script>
