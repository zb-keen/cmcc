import Vue from 'vue';
import Vuex from 'vuex';
import Vconsole from 'vconsole';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/assets/styles/main.scss';
import '@/assets/font/iconfont.css';
import '@/utils/vant';
import 'amfe-flexible/index.js';
import CONSTANTS from '@/utils/constants.js';

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register(`${process.env.BASE_URL}service-worker.js`).then(registration => {
//       console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError);
//     });
//   });
// }

Vue.prototype.CONSTANTS = CONSTANTS; // 全局引入常量
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue(); // event bus
Vue.prototype.$isDistinct = false; // 去重开关
Vue.prototype.$isProvinceDistinct = false; // 省份维度链接去重开关，为true时按省份维度去重
if (typeof process && process.env.NODE_ENV !== 'production') {
  const vConsole = new Vconsole();
  Vue.use(vConsole);
}

Vue.config.productionTip = false;

// 给大模型全局暴露vue
window.Vue = Vue
window.Vuex = Vuex

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
