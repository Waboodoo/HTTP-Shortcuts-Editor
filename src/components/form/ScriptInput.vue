<template>
    <labelled :label="label" class="script-input">
        <prism-editor
            class="script-input__editor"
            :value="code"
            :placeholder="placeholder"
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
import 'prismjs/themes/prism-coy.css';

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
        highlighter(code) {
            return highlight(code, languages.js, 'js');
        },
        onInput(value) {
            this.code = value;
            this.$emit('input', value);
        },
        insertVariable(variable) {
            // TODO: Insert at cursor instead of end
            this.onInput(`${this.code}getVariable('${variable.key}')`);
        },
    },
};
</script>

<style lang="sass" scoped>
.script-input__editor
    height: 250px
    background: #fafafa
    color: #2d2d2d
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace
    font-size: 14px
    line-height: 1.5
    padding: 5px

::v-deep .prism-editor__textarea:focus
    outline: none
</style>
