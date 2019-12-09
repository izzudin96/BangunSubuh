<template>
  <div id="app">
    <h1>{{ currentTime }}</h1>
    <input v-on:keyup.enter="getPrayerTime" v-model="location" type="text">
  </div>
</template>

<script>
const axios = require('axios');
const moment = require('moment');

export default {
  name: 'app',

  data() {
    return {
      location: 'Hamilton, New Zealand',
      prayerTimes: null,
      todayPrayerTime: null,
      currentTime: null,
    }
  },

  mounted() {
    this.getPrayerTime();
    this.updateTime();
  },

  methods: {
    getPrayerTime() {
      axios.get('https://api.aladhan.com/v1/calendarByAddress?address=' + this.location + '&method=2&month=12&year=2019')
              .then((response) => {
                this.prayerTimes = response.data['data'];
              })
              .then(() => {
                console.log(this.prayerTimes[0]['timings']['Maghrib']);
              })
              .catch(() => {
                this.getPrayerTime();
              });
    },

    setTime() {
      this.currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    },

    updateTime() {
      setInterval(this.setTime, 1000);
    }
  },
}
</script>

<style>

</style>
