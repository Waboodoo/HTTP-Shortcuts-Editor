import Vue from 'vue';
import Vuex from 'vuex';
import {
    Base,
    ParameterType,
    RequestBodyType,
} from '@/model';
import ValidationError from '@/store/errors/ValidationError';
import ApiError from '@/store/errors/ApiError';
import {
    replaceVariableKeysWithPlaceholders,
    replaceVariablePlaceholdersWithKeys,
} from '@/store/variables';
import i18next from 'i18next';

Vue.use(Vuex);

const REQUIRED_MIN_VERSION = 43;
const SUPPORTED_MAX_VERSION = 44;
const LOCAL_STORAGE_DEVICE_ID = 'device_id';
const API_PATH = 'api/files/';

const $t = i18next.t.bind(i18next);

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

function normalize(data: Base): Base {
    return {
        ...data,
        categories: data.categories.map((category) => ({
            ...category,
            shortcuts: category.shortcuts.map((shortcut) => ({
                ...shortcut,
                proxyHost: shortcut.proxyHost || null,
                proxyPort: shortcut.proxyPort || null,
            })),
        })),
    };
}

function validate(data: Base) {
    if (data.categories.every((category) => category.hidden)) {
        throw new ValidationError($t('validation.allCategoriesHidden'));
    }
    if (data.categories.some((category) => category.name.length === 0)) {
        throw new ValidationError($t('validation.unnamedCategories'));
    }
    if (data.variables.some((variable) => variable.key.length === 0)) {
        throw new ValidationError($t('validation.unnamedVariables'));
    }
    const variableKeys = data.variables.map((variable) => variable.key);
    if (variableKeys.length !== new Set(variableKeys).size) {
        throw new ValidationError($t('validation.duplicateVariables'));
    }
    if (data.categories.some(
        (category) => category.shortcuts.some(
            (shortcut) => shortcut.name.length === 0,
        ),
    )) {
        throw new ValidationError($t('validation.unnamedShortcuts'));
    }
    if (data.categories.some(
        (category) => category.shortcuts.some(
            (shortcut) => shortcut.headers.some(
                (header) => header.key.length === 0,
            ),
        ),
    )) {
        throw new ValidationError($t('validation.unnamedHeaders'));
    }
    if (data.categories.some(
        (category) => category.shortcuts.some(
            (shortcut) => shortcut.parameters.some(
                (parameter) => parameter.key.length === 0,
            ),
        ),
    )) {
        throw new ValidationError($t('validation.unnamedParameters'));
    }
    if (data.categories.some(
        (category) => category.shortcuts.some(
            (shortcut) => shortcut.requestBodyType === RequestBodyType.X_WWW_FORM_URLENCODE
                && shortcut.parameters.some(
                    (parameter) => parameter.type !== ParameterType.STRING,
                ),
        ),
    )) {
        throw new ValidationError($t('validation.invalidParameters'));
    }
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

                if (data.version < REQUIRED_MIN_VERSION || data.version > SUPPORTED_MAX_VERSION) {
                    throw new ValidationError($t('validation.incompatibleVersion'));
                }

                commit('SET_DATA', replaceVariablePlaceholdersWithKeys(normalize(data)));
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
                const base = state.data as Base;
                validate(base);
                const data = await makeApiRequest(
                    state.deviceId,
                    state.password,
                    'post',
                    replaceVariableKeysWithPlaceholders(base),
                );
                commit('SET_HAS_UNSAVED_CHANGES', false);
                return data.updatedShortcuts;
            } finally {
                commit('SET_SAVING', false);
            }
        },
    },
});
