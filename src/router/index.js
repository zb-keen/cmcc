import Vue from 'vue';
import VueRouter from 'vue-router';
import searchMain from '../views/SearchMain.vue'
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'searchMain',
    component: searchMain
  },
  {
    path: '/index.html',
    name: 'searchMain',
    component: searchMain
  },
  // {
  //   path: '/aes',
  //   name: 'aes',
  //   component: () => import('../views/aes.vue')
  // }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
