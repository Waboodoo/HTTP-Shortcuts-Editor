<template>
    <div class="input__container">
        <label v-if="label" :for="id" class="input__label">
            {{ label }}
        </label>
        <slot :id="id" @input="onInput" />
    </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
    props: {
        label: {
            type: String,
            default: '',
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
.input__container
    padding: 0
    margin: 5px 0 20px
    width: 100%
    cursor: text

.input__label
    display: block
    color: #000000
    margin-bottom: 4px
    font-weight: 500
</style>
