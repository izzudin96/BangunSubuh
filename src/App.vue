<template>
  <div id="app">
    <input v-on:keyup.enter="getPrayerTime" v-model="location" type="text">
  </div>
</template>

<script>
const axios = require('axios');

export default {
  name: 'app',

  data() {
    return {
      location: 'Hamilton, New Zealand',
      prayerTimes: null,
    }
  },

  mounted() {
    this.getPrayerTime();
  },

  methods: {
    getPrayerTime() {
      axios.get('https://api.aladhan.com/v1/calendarByAddress?address=' + this.location + '&method=2&month=12&year=2019')
              .then((response) => {
                this.prayerTimes = response.data['data'];
                console.log(this.prayerTimes);
              })
              .catch(() => {
                console.log('retrying!');
                this.getPrayerTime();
              });
    }
  },
}
</script>

<style>

</style>
