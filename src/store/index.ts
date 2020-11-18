import Vue from 'vue';
import Vuex from 'vuex';
import { Base } from '@/model';
import ValidationError from '@/store/errors/ValidationError';
import ApiError from '@/store/errors/ApiError';

Vue.use(Vuex);

const REQUIRED_VERSION = 41;
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
    throw new ApiError();
}

function validate(data: Base) {
    if (data.categories.every((category) => category.hidden)) {
        throw new ValidationError('There must be at least one category which isn\'t hidden.');
    }
    if (data.categories.some((category) => category.name.length === 0)) {
        throw new ValidationError('There must not be any categories without a name.');
    }
    if (data.categories.some(
        (category) => category.shortcuts.some(
            (shortcut) => shortcut.name.length === 0,
        ),
    )) {
        throw new ValidationError('There must not be any shortcuts without a name.');
    }
    // TODO Must not have any regular or browser shortcuts without a valid URL
}

export default new Vuex.Store({
    state: {
        deviceId: localStorage.getItem(LOCAL_STORAGE_DEVICE_ID) ?? '',
        password: '',
        data: null as Base | null,
        isLoading: false,
        isSaving: false,
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
        SET_SAVING(state, isSaving) {
            state.isSaving = isSaving;
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

                if (data.version !== REQUIRED_VERSION) {
                    throw new ValidationError('The version of the HTTP Shortcuts app is incompatible with this version of the editor.');
                }

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
        async saveData({ state, commit }) {
            commit('SET_SAVING', true);
            try {
                validate(state.data as Base);
                const data = await makeApiRequest(
                    state.deviceId,
                    state.password,
                    'post',
                    state.data,
                );
                commit('SET_HAS_UNSAVED_CHANGES', false);
                return data.updatedShortcuts;
            } finally {
                commit('SET_SAVING', false);
            }
        },
    },
});
