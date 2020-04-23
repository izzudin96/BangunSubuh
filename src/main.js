import Vue from 'vue'
import App from './App.vue'
import VueJSModal from "vue-js-modal";

Vue.config.productionTip = false

Vue.use(VueJSModal);

new Vue({
  render: h => h(App),
}).$mount('#app')
