<template>
    <div>
        <label for="device-id-input">
            Device ID
        </label>
        <input id="device-id-input" v-model="deviceId" :disabled="isLoading">
        <label for="password-input">
            Password
        </label>
        <input id="password-input" v-model="password" :disabled="isLoading" type="password">
        <button :disabled="!canSubmit" @click="onSubmit">OK</button>
    </div>
</template>

<script>
export default {
    props: {
        initialDeviceId: {
            type: String,
            default: '',
        },
        isLoading: {
            type: Boolean,
        },
    },
    data() {
        return {
            deviceId: this.initialDeviceId,
            password: '',
        };
    },
    computed: {
        canSubmit() {
            return !this.isLoading && this.deviceId.length && this.password.length;
        },
    },
    methods: {
        onSubmit() {
            // TODO: Validation
            this.$emit('submit', {
                deviceId: this.deviceId,
                password: this.password,
            });
        },
    },
};
</script>

<style scoped>

</style>
