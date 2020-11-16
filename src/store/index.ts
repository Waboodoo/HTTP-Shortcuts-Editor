import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const LOCAL_STORAGE_DEVICE_ID = 'device_id';
const API_PATH = 'api/files/';

async function makeApiRequest(
    deviceId: string,
    password: string,
    method?: string | null,
    body?: object | null,
) {
    const headers = new Headers();
    headers.set('Authorization', `Basic ${btoa(`${deviceId}:${password}`)}`);
    const response = await fetch(API_PATH, {
        headers,
        method: method || 'get',
        body: body ? JSON.stringify(body) : null,
    });
    if (response.ok) {
        return response.json();
    }
    throw new Error();
}

export default new Vuex.Store({
    state: {
        deviceId: localStorage.getItem(LOCAL_STORAGE_DEVICE_ID) ?? '',
        password: '',
        data: null,
        isLoading: false,
        hasUnsavedChanges: false,
    },
    getters: {
        isLoaded(state): boolean {
            return !state.isLoading && !!state.data;
        },
    },
    mutations: {
        SET_DEVICE_ID(state, deviceId) {
            state.deviceId = deviceId;
            localStorage.setItem(LOCAL_STORAGE_DEVICE_ID, deviceId);
        },
        SET_PASSWORD(state, password) {
            state.password = password;
        },
        SET_LOADING(state, isLoading) {
            state.isLoading = isLoading;
        },
        SET_DATA(state, data) {
            state.data = data;
        },
        SET_HAS_UNSAVED_CHANGES(state, hasUnsavedChanges) {
            state.hasUnsavedChanges = hasUnsavedChanges;
        },
    },
    actions: {
        setCredentials({ commit }, { deviceId, password }) {
            commit('SET_DEVICE_ID', deviceId);
            commit('SET_PASSWORD', password);
        },
        async loadData({ state, commit }) {
            try {
                commit('SET_LOADING', true);
                const data = await makeApiRequest(
                    state.deviceId,
                    state.password,
                );
                commit('SET_DATA', data);
                commit('SET_HAS_UNSAVED_CHANGES', false);
            } finally {
                commit('SET_LOADING', false);
            }
        },
        setData({ commit }, data) {
            commit('SET_DATA', data);
            commit('SET_HAS_UNSAVED_CHANGES', true);
        },
        async saveData({ state }) {
            const data = await makeApiRequest(
                state.deviceId,
                state.password,
                'post',
                state.data,
            );
            return data.updatedShortcuts;
        },
    },
});
