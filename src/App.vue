<template>
  <div id="app">
    <PrayerScheduler v-bind:prayerTimes="this.prayerTimes.data" />
  </div>
</template>

<script>
const axios = require('axios');
import PrayerScheduler from './components/PrayerScheduler'

export default {
  name: 'app',
  components: {
    PrayerScheduler,
  },

  data() {
    return {
      prayerTimes: null,
    }
  },

  mounted() {
    this.getPrayerTime();
  },

  methods: {
    getPrayerTime() {
      axios.get('https://api.aladhan.com/v1/calendarByAddress?address=Hamilton, New Zealand&method=2&month=12&year=2019')
              .then((response) => {
                this.prayerTimes = response.data;
                console.log(this.prayerTimes);
              })
    }
  },
}
</script>

<style>

</style>
