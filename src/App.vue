<template>
    <div id="app">
        <h1 class="bg-blue">{{ displayTime }}</h1>
        <input v-on:keyup.enter="getPrayerTime" v-model="location" type="text">
        <button @click="playAzan(azanPaths.AZAN1)">Play Azan</button>
        <hr>
        <div v-if="this.todayPrayerTimes">
            Subuh: {{ this.todayPrayerTimes['Fajr'] }} -
            <span v-if="this.currentTime < this.todayPrayerTimes['Fajr']">
                {{ parseInt(prayerTimesCountdown['Fajr'].asHours()) }} hours {{ parseInt(prayerTimesCountdown['Fajr'].asMinutes())%60 }} minutes and {{ parseInt(prayerTimesCountdown['Fajr'].asSeconds())%60 }} second
            </span>
        </div>

        <div v-if="this.todayPrayerTimes">
            Habis Waktu Subuh: {{ this.todayPrayerTimes['Sunrise'] }} -
            <span v-if="this.currentTime < this.todayPrayerTimes['Sunrise']">
                {{ parseInt(prayerTimesCountdown['Sunrise'].asHours()) }} hours {{ parseInt(prayerTimesCountdown['Sunrise'].asMinutes())%60 }} minutes and {{ parseInt(prayerTimesCountdown['Sunrise'].asSeconds())%60 }} second
            </span>
        </div>

        <div v-if="this.todayPrayerTimes">
            Zohor: {{ this.todayPrayerTimes['Dhuhr'] }} -
            <span v-if="this.currentTime < this.todayPrayerTimes['Dhuhr']">
                {{ parseInt(prayerTimesCountdown['Dhuhr'].asHours()) }} hours {{ parseInt(prayerTimesCountdown['Dhuhr'].asMinutes())%60 }} minutes and {{ parseInt(prayerTimesCountdown['Dhuhr'].asSeconds())%60 }} second
            </span>
        </div>

        <div v-if="this.todayPrayerTimes">
            Asar: {{ this.todayPrayerTimes['Asr'] }} -
            <span v-if="this.currentTime < this.todayPrayerTimes['Asr']">
                {{ parseInt(prayerTimesCountdown['Asr'].asHours()) }} hours {{ parseInt(prayerTimesCountdown['Asr'].asMinutes())%60 }} minutes and {{ parseInt(prayerTimesCountdown['Asr'].asSeconds())%60 }} second
            </span>
        </div>

        <div v-if="this.todayPrayerTimes">
            Maghrib: {{ this.todayPrayerTimes['Maghrib'] }} -
            <span v-if="this.currentTime < this.todayPrayerTimes['Maghrib']">
                {{ parseInt(prayerTimesCountdown['Maghrib'].asHours()) }} hours {{ parseInt(prayerTimesCountdown['Maghrib'].asMinutes())%60 }} minutes and {{ parseInt(prayerTimesCountdown['Maghrib'].asSeconds())%60 }} second
            </span>
        </div>

        <div v-if="this.todayPrayerTimes">
            Isyak: {{ this.todayPrayerTimes['Isha'] }} -
            <span v-if="this.currentTime < this.todayPrayerTimes['Isha']">
                {{ parseInt(prayerTimesCountdown['Isha'].asHours()) }} hours {{ parseInt(prayerTimesCountdown['Isha'].asMinutes())%60 }} minutes and {{ parseInt(prayerTimesCountdown['Isha'].asSeconds())%60 }} second
            </span>
        </div>
    </div>
</template>

<script>
    const axios = require('axios');
    const moment = require('moment');
    import '@/assets/css/main.css';

    const paths = {
        AZAN1: "/azan/UstazFahmiNahawandKurdi.mp3",
    };

    export default {
        name: 'app',

        data() {
            return {
                location: 'Hamilton, New Zealand',
                prayerTimes: null,
                todayPrayerTimes: null,
                tomorrowPrayerTimes: null,
                currentTime: null,
                azanPaths: paths,
            }
        },

        computed: {
            displayTime: function () {
                return moment(this.currentTime).format('MMMM Do YYYY, h:mm:ss a')
            },

            prayerTimesCountdown: function() {
                let countdown = {};

                if(this.prayerTimes != null) {
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
                        this.todayPrayerTimes = this.prayerTimes[date - 1]['timings'];
                        this.todayPrayerTimes['Asr'] = moment(this.todayPrayerTimes['Asr'], "HH:mm");
                        this.todayPrayerTimes['Dhuhr'] = moment(this.todayPrayerTimes['Dhuhr'], "HH:mm");
                        this.todayPrayerTimes['Fajr'] = moment(this.todayPrayerTimes['Fajr'], "HH:mm");
                        this.todayPrayerTimes['Imsak'] = moment(this.todayPrayerTimes['Imsak'], "HH:mm");
                        this.todayPrayerTimes['Isha'] = moment(this.todayPrayerTimes['Isha'], "HH:mm");
                        this.todayPrayerTimes['Maghrib'] = moment(this.todayPrayerTimes['Maghrib'], "HH:mm");
                        this.todayPrayerTimes['Midnight'] = moment(this.todayPrayerTimes['Midnight'], "HH:mm");
                        this.todayPrayerTimes['Sunrise'] = moment(this.todayPrayerTimes['Sunrise'], "HH:mm");
                        this.todayPrayerTimes['Sunset'] = moment(this.todayPrayerTimes['Sunset'], "HH:mm");
                    })
                    .catch(() => {
                        this.getPrayerTime();
                    });
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

                if(time == this.todayPrayerTimes['Fajr'].format("HH:mm:ss")) {
                    this.playAzan(this.azanPaths.AZAN1);
                } else if(time == this.todayPrayerTimes['Dhuhr'].format("HH:mm:ss")) {
                    this.playAzan(this.azanPaths.AZAN1);
                } else if(time == this.todayPrayerTimes['Asr'].format("HH:mm:ss")) {
                    this.playAzan(this.azanPaths.AZAN1);
                } else if(time == this.todayPrayerTimes['Maghrib'].format("HH:mm:ss")) {
                    this.playAzan(this.azanPaths.AZAN1);
                } else if(time == this.todayPrayerTimes['Isha'].format("HH:mm:ss")) {
                    this.playAzan(this.azanPaths.AZAN1);
                }
            },

            playAzan(azan) {
                if(azan) {
                    let audio = new Audio(azan);
                    audio.play();
                }
            },
        },
    }
</script>

<style>

</style>
