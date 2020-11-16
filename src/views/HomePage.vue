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
        </template>
    </page>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import Vue from 'vue';
import InitForm from '@/components/InitForm.vue';
import Page from '@/views/Page.vue';

export default Vue.extend({
    components: {
        InitForm,
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
                console.log(e);
                // TODO: Check error and use appropriate error message
                this.error = 'Failed to open editor';
            }
        },
        clearError() {
            this.error = '';
        },
    },
});
</script>

<style lang="sass" scoped>
.login-form
    width: 400px
    margin: 20px auto
</style>
