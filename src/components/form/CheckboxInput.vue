<template>
    <labelled :label="label" v-slot="{ id }">
        <input
            :id="id"
            ref="input"
            class="input__value"
            :checked="value"
            v-bind="$attrs"
            value="1"
            type="checkbox"
            @input="onInput"
        >
    </labelled>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import Labelled from '@/components/form/Labelled.vue';

export default {
    components: {
        Labelled,
    },
    props: {
        label: {
            type: String,
            default: null,
        },
        value: {
            type: Boolean,
        },
    },
    data() {
        return {
            id: null,
        };
    },
    mounted() {
        this.id = uuidv4();
    },
    methods: {
        focus() {
            this.$refs.input.focus();
        },
        onInput(event) {
            this.$emit('input', event.target.checked);
        },
    },
};
</script>

<style lang="sass" scoped>
.input__value
    border: none
    outline: none
    background-color: transparent
    padding: 4px 0

    &:focus, &:active
        border-bottom-color: #0277bd

    &::placeholder
        color: #666666
</style>
