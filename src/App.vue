<template>
    <div id="app">
        <h1>{{ displayTime }}</h1>
        <input v-on:keyup.enter="getPrayerTime" v-model="location" type="text">
        <button @click="playAzan(azanPaths.AZAN1)">Play Azan</button>
        <hr>
        <div v-if="this.todayPrayerTimes">
            Subuh: {{ this.todayPrayerTimes['Fajr'] }} -
            <span v-if="fajrShow">
                {{ parseInt(prayerTimesCountdown['Fajr'].asHours()) }} hours {{ parseInt(prayerTimesCountdown['Fajr'].asMinutes())%60 }} minutes and {{ parseInt(prayerTimesCountdown['Fajr'].asSeconds())%60 }} second
            </span>
        </div>

        <div v-if="this.todayPrayerTimes">
            Habis Waktu Subuh: {{ this.todayPrayerTimes['Sunrise'] }} -
            <span v-if="sunriseShow">
                {{ parseInt(prayerTimesCountdown['Sunrise'].asHours()) }} hours {{ parseInt(prayerTimesCountdown['Sunrise'].asMinutes())%60 }} minutes and {{ parseInt(prayerTimesCountdown['Sunrise'].asSeconds())%60 }} second
            </span>
        </div>

        <div v-if="this.todayPrayerTimes">
            Zohor: {{ this.todayPrayerTimes['Dhuhr'] }} -
            <span v-if="dhuhrShow">
                {{ parseInt(prayerTimesCountdown['Dhuhr'].asHours()) }} hours {{ parseInt(prayerTimesCountdown['Dhuhr'].asMinutes())%60 }} minutes and {{ parseInt(prayerTimesCountdown['Dhuhr'].asSeconds())%60 }} second
            </span>
        </div>

        <div v-if="this.todayPrayerTimes">
            Asar: {{ this.todayPrayerTimes['Asr'] }} -
            <span v-if="asrShow">
                {{ parseInt(prayerTimesCountdown['Asr'].asHours()) }} hours {{ parseInt(prayerTimesCountdown['Asr'].asMinutes())%60 }} minutes and {{ parseInt(prayerTimesCountdown['Asr'].asSeconds())%60 }} second
            </span>
        </div>

        <div v-if="this.todayPrayerTimes">
            Maghrib: {{ this.todayPrayerTimes['Maghrib'] }} -
            <span v-if="maghribShow">
                {{ parseInt(prayerTimesCountdown['Maghrib'].asHours()) }} hours {{ parseInt(prayerTimesCountdown['Maghrib'].asMinutes())%60 }} minutes and {{ parseInt(prayerTimesCountdown['Maghrib'].asSeconds())%60 }} second
            </span>
        </div>

        <div v-if="this.todayPrayerTimes">
            Isyak: {{ this.todayPrayerTimes['Isha'] }} -
            <span v-if="ishaShow">
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
                currentTime: null,
                azanPaths: paths,
                isEndOfDay: false,
            }
        },

        computed: {
            displayTime: function () {
                return moment(this.currentTime).format('MMMM Do YYYY, h:mm:ss a')
            },

            fajrShow: function() {
                return this.currentTime.isBefore(this.todayPrayerTimes['Fajr']) || this.isEndOfDay;
            },

            sunriseShow: function() {
                return this.currentTime.isBefore(this.todayPrayerTimes['Sunrise']) || this.isEndOfDay;
            },

            dhuhrShow: function() {
                return this.currentTime.isBefore(this.todayPrayerTimes['Dhuhr']) || this.isEndOfDay;
            },

            asrShow: function() {
                return this.currentTime.isBefore(this.todayPrayerTimes['Asr']) || this.isEndOfDay;
            },

            maghribShow: function() {
                return this.currentTime.isBefore(this.todayPrayerTimes['Maghrib']) || this.isEndOfDay;
            },

            ishaShow: function() {
                return this.currentTime.isBefore(this.todayPrayerTimes['Isha']) || this.isEndOfDay;
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

            setTomorrowPrayerTimes() {
                let day = moment(this.currentTime.add(1, 'days')).format("D");
                let month = moment(this.currentTime.add(1, 'days')).format("M");
                let year = moment(this.currentTime.add(1, 'days')).format("Y");
                this.getPrayerTime(day, month, year);
                this.isEndOfDay = true;
            },

            setTime() {
                this.currentTime = moment().subtract(300, 'minutes');
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
                    this.setTomorrowPrayerTimes();
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
