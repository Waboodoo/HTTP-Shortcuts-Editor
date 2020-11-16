<template>
    <div class="shortcut">
        <div class="shortcut__header" @click="toggle">
            <div class="shortcut__header__title">
                {{ shortcutTitle }}
            </div>
            <chevron
                :expanded="expanded"
                class="shortcut__header__chevron"
            />
        </div>
        <div v-if="expanded" class="shortcut__form">
            <text-input
                v-model="shortcutData.name"
                label="Shortcut Name"
                placeholder="Enter a name for this shortcut"
            />
            <text-input
                v-model="shortcutData.description"
                label="Description"
                placeholder="Enter a description for this shortcut"
            />
            <select-input
                v-if="isRegularShortcut"
                v-model="shortcutData.method"
                label="Method"
                :options="[
                    { value: 'GET', label: 'GET' },
                    { value: 'POST', label: 'POST' },
                    { value: 'PUT', label: 'PUT' },
                    { value: 'DELETE', label: 'DELETE' },
                    { value: 'PATCH', label: 'PATCH' },
                    { value: 'HEAD', label: 'HEAD' },
                    { value: 'OPTIONS', label: 'OPTIONS' },
                    { value: 'TRACE', label: 'TRACE' },
                ]"
            />
            <text-input
                v-if="usesUrl"
                v-model="shortcutData.url"
                label="URL"
                placeholder="Enter a URL for this shortcut"
            />

            <script-input
                v-if="usesScriptingBefore"
                v-model="shortcutData.codeOnPrepare"
                label="Run before Execution (JavaScript)"
            />
            <script-input
                v-if="usesScriptingOnSuccess"
                v-model="shortcutData.codeOnSuccess"
                label="Run after Execution (JavaScript)"
            />
            <script-input
                v-if="usesScriptingOnFailure"
                v-model="shortcutData.codeOnFailure"
                label="Run on Failure (JavaScript)"
            />
            <!--
            TODO:
            - variable placeholders
            - headers
            - request body
            - authentication
            - response handling
            - scripting
            - misc settings
            - advanced settings
            - trigger shortcuts
            -->
        </div>
    </div>
</template>

<script>
import Chevron from '@/components/Chevron.vue';
import ScriptInput from '@/components/form/ScriptInput.vue';
import SelectInput from '@/components/form/SelectInput.vue';
import TextInput from '@/components/form/TextInput.vue';
import { ExecutionType } from '@/model';

export default {
    components: {
        Chevron,
        ScriptInput,
        SelectInput,
        TextInput,
    },
    props: {
        shortcut: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            expanded: false,
            shortcutData: { ...this.shortcut },
        };
    },
    watch: {
        shortcutData: {
            handler(newData) {
                this.$emit('update:shortcut', newData);
            },
            deep: true,
        },
    },
    computed: {
        shortcutTitle() {
            return this.shortcutData.name.length > 0
                ? this.shortcutData.name
                : '-';
        },
        isRegularShortcut() {
            return this.shortcutData.executionType === ExecutionType.APP;
        },
        isBrowserShortcut() {
            return this.shortcutData.executionType === ExecutionType.BROWSER;
        },
        usesUrl() {
            return this.isRegularShortcut || this.isBrowserShortcut;
        },
        usesScriptingBefore() {
            return this.shortcut.executionType !== ExecutionType.TRIGGER;
        },
        usesScriptingOnSuccess() {
            return this.isRegularShortcut;
        },
        usesScriptingOnFailure() {
            return this.isRegularShortcut;
        },
    },
    methods: {
        toggle() {
            this.expanded = !this.expanded;
        },
    },
};
</script>

<style lang="sass" scoped>
.shortcut
    background: #ffffff
    border: 1px solid #CCCCCC
    margin: 10px 0

    &__header
        display: flex
        cursor: pointer
        align-items: center

        &__title
            font-size: 1.4em
            padding: 10px
            flex: 1 1 auto

        &__chevron
            flex: 0 0 auto
            width: 18px
            height: 18px
            margin: 10px

    &__form
        padding: 0 12px
</style>
