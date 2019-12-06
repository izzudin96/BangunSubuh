<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="What the hell"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
const axios = require('axios');

export default {
  name: 'app',
  components: {
    HelloWorld
  },

  mounted() {
    axios.get('google.com').then(function() {
      alert('hello again');
    }).catch(function() {
      alert('not hello');
    });
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
