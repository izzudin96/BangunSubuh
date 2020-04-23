<template>
    <div id="app" class="container mx-auto text-white">
        <modal name="popup" width="30%" height="50%">
            <h4 class="text-center text-black text-2xl">Ramadhan Karim. Selamat Berpuasa dan Bangun Subuh</h4>
            <h6 class="text-center text-black text-2xl">dari Izzudin Anuar</h6>
        </modal>

        <div class="flex-row">
            <h1 class="text-center text-6xl">{{ displayTime }}</h1>
            <h2 class="text-center text-3xl">{{ displayDate }}</h2>
        </div>
        <div class="flex justify-center">
            <input class="shadow appearance-none border rounded w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   v-on:keyup.enter="getPrayerTime" v-model="location" type="text">
        </div>
        <div class="flex justify-center p-5">
            <button @click="playAzan(azanPaths.AZAN1)">Play Azan</button>
        </div>

        <div v-if="this.todayPrayerTimes" class="flex space-around justify-center">
            <div class="flex-col p-10 w-1/3">
                <div class="text-5xl text-center">
                    Subuh
                </div>
                <div class="text-4xl text-center">
                    {{ fajrTime }}
                </div>
                <div class="text-xl text-center" v-if="fajrShow">
                    {{ fajrCountdown }}
                </div>
            </div>

            <div class="flex-col p-10 w-1/3">
                <div class="text-5xl text-center">
                    Subuh Habis
                </div>
                <div class="text-4xl text-center">
                    {{ sunriseTime }}
                </div>
                <div class="text-xl text-center" v-if="sunriseShow">
                    {{ sunriseCountdown }}
                </div>
            </div>

            <div class="flex-col p-10 w-1/3">
                <div class="text-5xl text-center">
                    Zohor
                </div>
                <div class="text-4xl text-center">
                    {{ dhuhrTime }}
                </div>
                <div class="text-xl text-center" v-if="dhuhrShow">
                    {{ dhuhrCountdown }}
                </div>
            </div>
        </div>

        <div v-if="this.todayPrayerTimes" class="flex space-around justify-center">
            <div class="flex-col p-10 w-1/3">
                <div class="text-5xl text-center">
                    Asar
                </div>
                <div class="text-4xl text-center">
                    {{ asrTime }}
                </div>
                <div class="text-xl text-center" v-if="asrShow">
                    {{ asrCountdown }}
                </div>
            </div>

            <div class="flex-col p-10 w-1/3">
                <div class="text-5xl text-center">
                    Maghrib
                </div>
                <div class="text-4xl text-center">
                    {{ maghribTime }}
                </div>
                <div class="text-xl text-center" v-if="maghribShow">
                    {{ maghribCountdown }}
                </div>
            </div>

            <div class="flex-col p-10 w-1/3">
                <div class="text-5xl text-center">
                    Isha'
                </div>
                <div class="text-4xl text-center">
                    {{ ishaTime }}
                </div>
                <div class="text-xl text-center" v-if="ishaShow">
                    {{ ishaCountdown }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  const axios = require('axios');
  const moment = require('moment');
  import '@/assets/css/main.css';

  const paths = {
    AZAN1: "/azan/Azan2020.mp3",
  };

  export default {
    name: 'app',

    data() {
      return {
        location: 'Hamilton, New Zealand',
        prayerTimes: null,
        todayPrayerTimes: null,
        currentTime: null,
        azanPaths: paths,
        isEndOfDay: false,
      }
    },

    computed: {
      displayTime: function () {
        return moment(this.currentTime).format('h:mm:ss a');
      },

      displayDate: function () {
        return moment(this.currentTime).format('MMMM Do YYYY');
      },

      fajrShow: function () {
        return this.currentTime.isBefore(this.todayPrayerTimes['Fajr']) || this.isEndOfDay;
      },

      sunriseShow: function () {
        return this.currentTime.isBefore(this.todayPrayerTimes['Sunrise']) || this.isEndOfDay;
      },

      dhuhrShow: function () {
        return this.currentTime.isBefore(this.todayPrayerTimes['Dhuhr']) || this.isEndOfDay;
      },

      asrShow: function () {
        return this.currentTime.isBefore(this.todayPrayerTimes['Asr']) || this.isEndOfDay;
      },

      maghribShow: function () {
        return this.currentTime.isBefore(this.todayPrayerTimes['Maghrib']) || this.isEndOfDay;
      },

      ishaShow: function () {
        return this.currentTime.isBefore(this.todayPrayerTimes['Isha']) || this.isEndOfDay;
      },

      fajrTime: function () {
        return this.todayPrayerTimes['Fajr'].format('h:mm:ss a');
      },

      sunriseTime: function () {
        return this.todayPrayerTimes['Sunrise'].format('h:mm:ss a');
      },

      dhuhrTime: function () {
        return this.todayPrayerTimes['Dhuhr'].format('h:mm:ss a');
      },

      asrTime: function () {
        return this.todayPrayerTimes['Asr'].format('h:mm:ss a');
      },

      maghribTime: function () {
        return this.todayPrayerTimes['Maghrib'].format('h:mm:ss a');
      },

      ishaTime: function () {
        return this.todayPrayerTimes['Isha'].format('h:mm:ss a');
      },

      fajrCountdown: function () {
        return parseInt(this.prayerTimesCountdown['Fajr'].asHours()) + " hours " + parseInt(this.prayerTimesCountdown['Fajr'].asMinutes()) % 60 + " minutes and " + parseInt(this.prayerTimesCountdown['Fajr'].asSeconds()) % 60 + " seconds";
      },

      sunriseCountdown: function () {
        return parseInt(this.prayerTimesCountdown['Sunrise'].asHours()) + " hours " + parseInt(this.prayerTimesCountdown['Sunrise'].asMinutes()) % 60 + " minutes and " + parseInt(this.prayerTimesCountdown['Sunrise'].asSeconds()) % 60 + " seconds";
      },

      dhuhrCountdown: function () {
        return parseInt(this.prayerTimesCountdown['Dhuhr'].asHours()) + " hours " + parseInt(this.prayerTimesCountdown['Dhuhr'].asMinutes()) % 60 + " minutes and " + parseInt(this.prayerTimesCountdown['Dhuhr'].asSeconds()) % 60 + " seconds";
      },

      asrCountdown: function () {
        return parseInt(this.prayerTimesCountdown['Asr'].asHours()) + " hours " + parseInt(this.prayerTimesCountdown['Asr'].asMinutes()) % 60 + " minutes and " + parseInt(this.prayerTimesCountdown['Asr'].asSeconds()) % 60 + " seconds";
      },

      maghribCountdown: function () {
        return parseInt(this.prayerTimesCountdown['Maghrib'].asHours()) + " hours " + parseInt(this.prayerTimesCountdown['Maghrib'].asMinutes()) % 60 + " minutes and " + parseInt(this.prayerTimesCountdown['Maghrib'].asSeconds()) % 60 + " seconds";
      },

      ishaCountdown: function () {
        return parseInt(this.prayerTimesCountdown['Isha'].asHours()) + " hours " + parseInt(this.prayerTimesCountdown['Isha'].asMinutes()) % 60 + " minutes and " + parseInt(this.prayerTimesCountdown['Isha'].asSeconds()) % 60 + " seconds";
      },

      prayerTimesCountdown: function () {
        let countdown = {};

        if (this.prayerTimes != null) {
          countdown['Asr'] = moment.duration(this.todayPrayerTimes['Asr'].diff(this.currentTime));
          countdown['Dhuhr'] = moment.duration(this.todayPrayerTimes['Dhuhr'].diff(this.currentTime));
          countdown['Fajr'] = moment.duration(this.todayPrayerTimes['Fajr'].diff(this.currentTime));
          countdown['Imsak'] = moment.duration(this.todayPrayerTimes['Imsak'].diff(this.currentTime));
          countdown['Isha'] = moment.duration(this.todayPrayerTimes['Isha'].diff(this.currentTime));
          countdown['Maghrib'] = moment.duration(this.todayPrayerTimes['Maghrib'].diff(this.currentTime));
          countdown['Midnight'] = moment.duration(this.todayPrayerTimes['Midnight'].diff(this.currentTime));
          countdown['Sunrise'] = moment.duration(this.todayPrayerTimes['Sunrise'].diff(this.currentTime));
          countdown['Sunset'] = moment.duration(this.todayPrayerTimes['Sunset'].diff(this.currentTime));
        }

        return countdown;
      },
    },

    mounted() {
      window.moment = moment;
      this.$modal.show('popup');
      this.setTime();
      this.updateTime();

      let day = moment(this.currentTime).format("D");
      let month = moment(this.currentTime).format("M");
      let year = moment(this.currentTime).format("Y");

      this.getPrayerTime(day, month, year);
    },

    methods: {
      getPrayerTime(day, month, year) {
        let method = 2;

        axios.get('https://api.aladhan.com/v1/calendarByAddress?address=' + this.location + `&method=${method}&month=${month}&year=${year}`)
          .then((response) => {
            this.prayerTimes = response.data['data'];
            this.todayPrayerTimes = this.prayerTimes[day - 1]['timings'];
            this.todayPrayerTimes['Asr'] = moment(this.todayPrayerTimes['Asr'], "HH:mm").year(year).month(month - 1).date(day);
            this.todayPrayerTimes['Dhuhr'] = moment(this.todayPrayerTimes['Dhuhr'], "HH:mm").year(year).month(month - 1).date(day);
            this.todayPrayerTimes['Fajr'] = moment(this.todayPrayerTimes['Fajr'], "HH:mm").year(year).month(month - 1).date(day);
            this.todayPrayerTimes['Imsak'] = moment(this.todayPrayerTimes['Imsak'], "HH:mm").year(year).month(month - 1).date(day);
            this.todayPrayerTimes['Isha'] = moment(this.todayPrayerTimes['Isha'], "HH:mm").year(year).month(month - 1).date(day);
            this.todayPrayerTimes['Maghrib'] = moment(this.todayPrayerTimes['Maghrib'], "HH:mm").year(year).month(month - 1).date(day);
            this.todayPrayerTimes['Midnight'] = moment(this.todayPrayerTimes['Midnight'], "HH:mm").year(year).month(month - 1).date(day);
            this.todayPrayerTimes['Sunrise'] = moment(this.todayPrayerTimes['Sunrise'], "HH:mm").year(year).month(month - 1).date(day);
            this.todayPrayerTimes['Sunset'] = moment(this.todayPrayerTimes['Sunset'], "HH:mm").year(year).month(month - 1).date(day);
          })
          .catch(() => {
            this.getPrayerTime();
          });
      },

      setTomorrowPrayerTimes() {
        let day = moment(this.currentTime.add(1, 'days')).format("D");
        let month = moment(this.currentTime.add(1, 'days')).format("M");
        let year = moment(this.currentTime.add(1, 'days')).format("Y");
        this.isEndOfDay = true;
        this.getPrayerTime(day, month, year);
      },

      setTime() {
        this.currentTime = moment();
      },

      updateTime() {
        setInterval(this.setTime, 1000);
        setInterval(this.playAzanIfTimed, 1000);
      },

      playAzanIfTimed() {
        let time = this.currentTime.format("HH:mm:ss");

        if (time == this.todayPrayerTimes['Fajr'].format("HH:mm:ss")) {
          this.isEndOfDay = false;
          this.playAzan(this.azanPaths.AZAN1);
        } else if (time == this.todayPrayerTimes['Dhuhr'].format("HH:mm:ss")) {
          this.playAzan(this.azanPaths.AZAN1);
        } else if (time == this.todayPrayerTimes['Asr'].format("HH:mm:ss")) {
          this.playAzan(this.azanPaths.AZAN1);
        } else if (time == this.todayPrayerTimes['Maghrib'].format("HH:mm:ss")) {
          this.playAzan(this.azanPaths.AZAN1);
        } else if (time == this.todayPrayerTimes['Isha'].format("HH:mm:ss")) {
          this.playAzan(this.azanPaths.AZAN1);
          this.setTomorrowPrayerTimes();
        } else if (this.currentTime.isAfter(this.todayPrayerTimes['Isha']) && !this.isEndOfDay) {
          this.setTomorrowPrayerTimes();
        }
      },

      playAzan(azan) {
        if (azan) {
          let audio = new Audio(azan);
          audio.play();
        }
      },
    },
  }
</script>

<style>

</style>
