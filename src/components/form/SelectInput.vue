<template>
    <labelled :label="label" v-slot="{ id }">
        <select
            :id="id"
            ref="input"
            class="input__value"
            v-bind="$attrs"
            @input="onInput"
        >
            <option
                v-for="option in options"
                :key="option.value"
                :selected="option.value === value"
            >{{ option.label }}</option>
        </select>
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
            type: String,
            default: null,
        },
        options: {
            type: Array,
            required: true,
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
            this.$emit('input', event.target.value);
        },
    },
};
</script>

<style lang="sass" scoped>
.input__value
    width: 100%
    border: none
    outline: none
    overflow: hidden
    background-color: transparent
    color: #0F0F0F
    padding: 4px 0
    font-size: 16px
    line-height: 20px
    border-bottom: 1px solid #E0E0E0

    &:focus, &:active
        border-bottom-color: #0277bd

    &::placeholder
        color: #666666
</style>
