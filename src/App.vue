<template>
  <div id="app">
    <!-- <app-player v-if="player" @click="player!=player"></app-player>
    <app-player v-else></app-player>
    <button></button> -->
    <development></development>
    <router-view/>
    <clock></clock>
  </div>
</template>
<script>
import Development from './components/Development.vue'
import Clock from './components/Clock.vue'
import AppPlayer from './components/Player.vue'
export default {
  data(){
    return{
      player:false
    }
  },
  components: {
    AppPlayer,
    Development,
    Clock
  }
}
</script>
<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
