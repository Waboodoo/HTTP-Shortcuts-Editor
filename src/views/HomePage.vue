<template>
    <div class="home">
        <init-form
            :initial-device-id="deviceId"
            :is-loading="isLoading"
            @submit="onSubmit" />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import Vue from 'vue';
import InitForm from '@/components/InitForm.vue';

export default Vue.extend({
    components: {
        InitForm,
    },
    computed: {
        ...mapState(['isLoading', 'deviceId']),
    },
    methods: {
        ...mapActions(['setCredentials', 'loadData']),
        async onSubmit({ deviceId, password }) {
            this.setCredentials({ deviceId, password });
            try {
                await this.loadData();
                await this.$router.push('/edit');
            } catch (e) {
                // eslint-disable-next-line no-alert
                alert(e);
            }
        },
    },
});
</script>
