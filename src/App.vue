<template>
  <div id="app" class="flex-column flex-column h-100">
    <div>
      <b-navbar toggleable="lg" variant="info" type="dark">
        <b-navbar-brand>BANZAI-Web</b-navbar-brand>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="#">Link</b-nav-item>
          </b-navbar-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <MainWindow></MainWindow>
    </div>
  </div>
</template>
<script>
import MainWindow from '@/components/MainWindow';

export default {
  name: 'App',
  components: {
    MainWindow
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
