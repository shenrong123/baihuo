import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import iView from 'iview';
import './assets/index.less';
import 'iview/dist/styles/iview.css'

Vue.config.productionTip = false;

Vue.use(iView);
// 切换路由时 loading bar 状态
router.beforeEach((to, from, next) => {
  // TODO
  (iView as any).LoadingBar.start();
  next();
});

router.afterEach(route => {
  // TODO
  (iView as any).LoadingBar.finish();
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
