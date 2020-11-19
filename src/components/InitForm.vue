<template>
    <div class="init-form">
        <label for="device-id-input">
            Device ID
        </label>
        <input
            id="device-id-input"
            v-model="deviceId"
            :disabled="isLoading"
            @input="onInput"
        >
        <label for="password-input">
            Password
        </label>
        <input
            id="password-input"
            v-model="password"
            :disabled="isLoading"
            type="password"
            @input="onInput"
        >
        <button
            :disabled="!canSubmit"
            @click="onSubmit"
        >Start Editing</button>

        <span v-if="hasError" class="init-form__error">{{ error }}</span>
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
        error: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            deviceId: this.initialDeviceId,
            password: '',
        };
    },
    computed: {
        hasError() {
            return this.error.length > 0;
        },
        canSubmit() {
            return !this.isLoading && this.deviceId.length && this.password.length;
        },
    },
    methods: {
        onInput() {
            this.$emit('change');
        },
        onSubmit() {
            this.$emit('submit', {
                deviceId: this.deviceId,
                password: this.password,
            });
        },
    },
};
</script>

<style lang="sass" scoped>
.init-form
    background: #fafafa
    border: 1px solid #CCCCCC
    padding: 20px

    input
        display: block
        width: 100%
        margin-bottom: 10px
        padding: 3px

        &[disabled]
            background: #FFFFFF

    label
        display: block
        margin-bottom: 5px

    button
        padding: 5px 10px

    &__error
        margin-top: 10px
        display: block
        font-size: 14px
        color: #f03030
</style>
