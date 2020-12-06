import VuejsDialog from 'vuejs-dialog';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(VuejsDialog);

new Vue({
    router,
    store,
    render: (h) => h(App),
})
    .$mount('#app');
