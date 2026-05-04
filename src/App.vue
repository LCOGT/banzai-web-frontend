<template>
  <v-app>
    <v-app-bar id="title-bar" app dark color="grey">
      <v-img
        class="mx-2"
        src="@/assets/banzai-logo.png"
        max-height="40"
        max-width="40"
      ></v-img>
      <v-toolbar-title>BANZAI Web Tools</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
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
    MainWindow,
  },
  data: () => ({
    //
  }),
}
</script>

<style>
.title-bar {
  color: #065c99;
}
</style>
