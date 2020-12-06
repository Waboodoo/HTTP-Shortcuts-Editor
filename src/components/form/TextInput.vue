<template>
    <labelled :label="label" v-slot="{ id }">
        <textarea
            v-if="multiline"
            :id="id"
            ref="input"
            class="input__value multiline"
            :value="value"
            v-bind="$attrs"
            :placeholder="placeholder"
            contenteditable
            @input="onInput"
        />
        <input
            v-else
            :id="id"
            ref="input"
            class="input__value"
            :value="value"
            v-bind="$attrs"
            :placeholder="placeholder"
            contenteditable
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
            type: String,
            default: null,
        },
        placeholder: {
            type: String,
            default: '',
        },
        multiline: {
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
            this.$emit('input', event.target.value);
        },
        insertAtCursor(text) {
            const { input } = this.$refs;
            if (input.selectionStart || input.selectionStart === 0) {
                const startPos = input.selectionStart;
                const endPos = input.selectionEnd;
                input.value = input.value.substring(0, startPos)
                    + text
                    + input.value.substring(endPos, input.value.length);
                input.selectionStart = startPos + text.length;
                input.selectionEnd = startPos + text.length;
            } else {
                input.value += text;
            }
            this.$emit('input', this.$refs.input.value);
            this.$refs.input.focus();
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

    &.multiline
        resize: vertical
        height: 150px
        overflow-y: auto

    &:focus, &:active
        border-bottom-color: #0277bd

    &::placeholder
        color: #666666
</style>
