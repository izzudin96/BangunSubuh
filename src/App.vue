<template>
  <div id="app">
    <h1>{{ displayTime }}</h1>
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
      tomorrowPrayerTime: null,
      currentTime: null,
    }
  },

  computed: {
    displayTime: function() {
      return moment(this.currentTime).format('MMMM Do YYYY, h:mm:ss a')
    },
  },

  mounted() {
    this.setTime();
    this.updateTime();
    this.getPrayerTime();
  },

  methods: {
    getPrayerTime() {
      let method = 2;
      let date = moment(this.currentTime).format("D");
      let month = moment(this.currentTime).format("M");
      let year = moment(this.currentTime).format("Y");

      axios.get('https://api.aladhan.com/v1/calendarByAddress?address=' + this.location + `&method=${method}&month=${month}&year=${year}`)
              .then((response) => {
                this.prayerTimes = response.data['data'];
                this.todayPrayerTime = this.prayerTimes[date - 1]['timings'];
              })
              .then(() => {
                console.log(this.prayerTimes[0]['timings']['Maghrib']);
              })
              .catch(() => {
                this.getPrayerTime();
              });
    },

    setTime() {
      this.currentTime = moment().format();
    },

    updateTime() {
      setInterval(this.setTime, 1000);
    }
  },
}
</script>

<style>

</style>
