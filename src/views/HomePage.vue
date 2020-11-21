<template>
    <page>
        <template #main>
            <init-form
                :initial-device-id="deviceId"
                :is-loading="isLoading"
                :error="error"
                class="login-form"
                @submit="onSubmit"
                @change="clearError"
            />

            <notice class="notice">
                <p>
                    To use the <b>HTTP&nbsp;Shortcuts&nbsp;Editor</b>, make sure you have the latest
                    version of the <b>HTTP&nbsp;Shortcuts</b> app installed. Open the app, go to
                    <b>Settings&nbsp;&gt;&nbsp;Edit&nbsp;on&nbsp;Computer</b> and follow the
                    instructions inside the app.
                </p>
                <p>
                    <b>Please note</b> that this editor is in an early development stage and
                    currently only supports a small subset of the features of the app.
                </p>
            </notice>

            <notice class="notice">
                <p>
                    This web app is also open source. You can host your own.
                    Find it on <a href="https://github.com/Waboodoo/HTTP-Shortcuts-Editor" target="_blank" rel="noreferrer noopener">Github</a>.
                </p>
            </notice>
        </template>
    </page>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import Vue from 'vue';
import Notice from '@/components/basic/Notice.vue';
import InitForm from '@/components/InitForm.vue';
import Page from '@/views/Page.vue';
import ApiError from '@/store/errors/ApiError';

export default Vue.extend({
    components: {
        InitForm,
        Notice,
        Page,
    },
    computed: {
        ...mapState(['isLoading', 'deviceId']),
    },
    data() {
        return {
            error: '',
        };
    },
    methods: {
        ...mapActions(['setCredentials', 'loadData']),
        async onSubmit({ deviceId, password }) {
            this.setCredentials({ deviceId, password });
            try {
                await this.loadData();
                await this.$router.push('/edit');
            } catch (e) {
                if (e instanceof ApiError) {
                    this.error = 'Incorrect device ID or password, or shortcuts were not pushed from app';
                } else {
                    this.error = 'Failed to open editor. Please try again';
                }
            }
        },
        clearError() {
            this.error = '';
        },
    },
});
</script>

<style lang="sass" scoped>
.login-form, .notice
    width: 100%
    max-width: 400px
    margin: 20px auto

.login-form
    margin-top: 0
</style>
