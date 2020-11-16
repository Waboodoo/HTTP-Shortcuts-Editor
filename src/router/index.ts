import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import EditorPage from '@/views/EditorPage.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        component: HomePage,
    },
    {
        path: '/edit',
        name: 'Editor',
        component: EditorPage,
    },
];

const router = new VueRouter({
    base: '/editor',
    routes,
});

export default router;
