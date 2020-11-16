<template>
    <labelled :label="label" class="script-input">
        <prism-editor
            class="script-input__editor"
            :value="code"
            :highlight="highlighter"
            @input="onInput"
        />
    </labelled>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import Labelled from '@/components/form/Labelled.vue';
import { PrismEditor } from 'vue-prism-editor';

import 'vue-prism-editor/dist/prismeditor.min.css';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

export default {
    components: {
        Labelled,
        PrismEditor,
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
    },
    data() {
        return {
            id: null,
            code: this.value,
        };
    },
    mounted() {
        this.id = uuidv4();
    },
    methods: {
        focus() {
            this.$refs.input.focus();
        },
        highlighter(code) {
            return highlight(code, languages.js, 'js');
        },
        onInput(value) {
            this.code = value;
            this.$emit('input', value);
        },
    },
};
</script>

<style lang="sass" scoped>
.script-input__editor
    height: 250px
    background: #2d2d2d
    color: #cccccc
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace
    font-size: 14px
    line-height: 1.5
    padding: 5px

::v-deep .prism-editor__container
    height: 100%

::v-deep .prism-editor__textarea:focus
    outline: none
</style>
