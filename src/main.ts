import VuejsDialog from 'vuejs-dialog';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import initI18n from '@/i18n';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(VuejsDialog, {
    html: true,
    okText: 'OK',
    cancelText: 'Cancel',
});

const i18n = initI18n();

new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
})
    .$mount('#app');
