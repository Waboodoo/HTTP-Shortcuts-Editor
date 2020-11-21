<template>
    <div class="shortcut">
        <!-- TODO: trigger shortcuts -->

        <div class="shortcut__header" @click="toggle">
            <icon class="shortcut__header__drag-handle" name="drag-handle" />
            <div class="shortcut__header__title">
                {{ shortcutTitle }}
                <span
                    v-if="shortcutTitleSuffix"
                    class="shortcut__header__title__suffix"
                >{{ shortcutTitleSuffix }}</span>
            </div>
            <icon
                class="shortcut__header__copy-button"
                name="copy"
                title="Duplicate Shortcut"
                @click.stop="onCopyClicked"
            />
            <icon
                class="shortcut__header__delete-button"
                name="delete"
                title="Delete Shortcut"
                @click.stop="onDeleteClicked"
            />
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

            <form-section
                v-if="isRegularShortcut || isBrowserShortcut"
                title="Basic Request Settings"
            >
                <select-input
                    v-if="isRegularShortcut"
                    v-model="shortcutData.method"
                    label="Method"
                    :options="[
                        { value: HttpMethod.GET, label: 'GET' },
                        { value: HttpMethod.POST, label: 'POST' },
                        { value: HttpMethod.PUT, label: 'PUT' },
                        { value: HttpMethod.DELETE, label: 'DELETE' },
                        { value: HttpMethod.PATCH, label: 'PATCH' },
                        { value: HttpMethod.HEAD, label: 'HEAD' },
                        { value: HttpMethod.OPTIONS, label: 'OPTIONS' },
                        { value: HttpMethod.TRACE, label: 'TRACE' },
                    ]"
                />
                <text-input
                    v-if="usesUrl"
                    v-model="shortcutData.url"
                    label="URL"
                    placeholder="Enter a URL for this shortcut"
                />
            </form-section>

            <form-section v-if="isRegularShortcut" title="Request Headers">
                <template slot="header">
                    Not yet implemented. Coming soon (hopefully)
                </template>
                <!-- TODO -->
            </form-section>

            <form-section v-if="usesRequestBody" title="Request Body / Parameters">
                <template slot="header">
                    Not yet implemented. Coming soon (hopefully)
                </template>
                <!-- TODO -->
            </form-section>

            <form-section v-if="isRegularShortcut" title="Authentication">
                <select-input
                    v-model="shortcutData.authentication"
                    label="Authentication Method"
                    :options="[
                        { value: AuthenticationMethod.NONE, label: 'No Authentication' },
                        { value: AuthenticationMethod.BASIC, label: 'Basic Authentication' },
                        { value: AuthenticationMethod.DIGEST, label: 'Digest Authentication' },
                        { value: AuthenticationMethod.BEARER, label: 'Bearer Authentication' },
                    ]"
                />
                <text-input
                    v-if="usesUsernameAndPassword"
                    v-model="shortcutData.username"
                    label="Username"
                />
                <text-input
                    v-if="usesUsernameAndPassword"
                    v-model="shortcutData.password"
                    label="Password"
                />
                <text-input
                    v-if="usesAuthToken"
                    v-model="shortcutData.authToken"
                    label="Token"
                />
            </form-section>

            <form-section v-if="isRegularShortcut" title="Response Handling">
                <select-input
                    v-model="shortcutData.responseHandling.successOutput"
                    label="On Success"
                    :options="[
                        {
                            value: ResponseHandlingSuccessOutputType.RESPONSE,
                            label: 'Show the response',
                            },
                        {
                            value: ResponseHandlingSuccessOutputType.MESSAGE,
                            label: 'Show a message',
                            },
                        {
                            value: ResponseHandlingSuccessOutputType.NONE,
                            label: 'Show nothing (run silently)',
                        },
                    ]"
                />

                <text-input
                    v-if="usesSuccessMessage"
                    v-model="shortcutData.responseHandling.successMessage"
                    label="Message"
                    placeholder="Shortcut executed."
                />

                <select-input
                    v-model="shortcutData.responseHandling.failureOutput"
                    label="On Failure"
                    :options="[
                        {
                            value: ResponseHandlingFailureOutputType.DETAILED,
                            label: 'Show a detailed error message',
                            },
                        {
                            value: ResponseHandlingFailureOutputType.SIMPLE,
                            label: 'Show a simple error message',
                            },
                        {
                            value: ResponseHandlingFailureOutputType.NONE,
                            label: 'Show nothing (run silently)',
                        },
                    ]"
                />

                <select-input
                    v-if="usesDisplayType"
                    v-model="shortcutData.responseHandling.uiType"
                    label="Display Type"
                    :options="[
                        { value: ResponseHandlingType.TOAST, label: 'Toast Popup' },
                        { value: ResponseHandlingType.DIALOG, label: 'Dialog' },
                        { value: ResponseHandlingType.WINDOW, label: 'Window' },
                    ]"
                />
            </form-section>

            <form-section title="Scripting">
                <template slot="header">
                    See the <a href="https://http-shortcuts.rmy.ch/scripting" target="_blank">Scripting documentation</a> for more information.
                </template>
                <template>
                    <script-input
                        v-if="usesScriptingBefore"
                        v-model="shortcutData.codeOnPrepare"
                        label="Run before Execution"
                        :placeholder="
                            isScriptingShortcut
                            ? 'Add JavaScript code here'
                            : 'Add JavaScript code here to run before the shortcut is executed, ' +
                             'e.g., to prepare some variables.'
                        "
                    />
                    <script-input
                        v-if="usesScriptingOnSuccess"
                        v-model="shortcutData.codeOnSuccess"
                        label="Run after Execution"
                        :placeholder="'Add JavaScript code here to run after the shortcut is ' +
                            'executed, e.g., to process the response.'"
                    />
                    <script-input
                        v-if="usesScriptingOnFailure"
                        v-model="shortcutData.codeOnFailure"
                        label="Run on Failure"
                        placeholder="Add JavaScript code here to run in case the request fails."
                    />
                </template>
                <!-- TODO: Code Snippet Picker -->
                <!-- TODO: Replace variables with their names -->
            </form-section>

            <form-section title="Misc Settings">
                <checkbox-input
                    v-model="shortcutData.launcherShortcut"
                    label="Show as app shortcut on launcher"
                />
                <checkbox-input
                    v-model="shortcutData.quickSettingsTileShortcut"
                    label="Allow triggering via Quick Settings Tile"
                />
                <checkbox-input
                    v-model="shortcutData.requireConfirmation"
                    label="Require confirmation before execution"
                />
                <!-- TODO: Delay -->
            </form-section>

            <form-section v-if="isRegularShortcut" title="Advanced Technical Settings">
                <checkbox-input
                    :value="isWaitForInternet"
                    @input="
                        (value) => shortcutData.retryPolicy = value
                            ? RetryPolicy.WAIT_FOR_INTERNET
                            : RetryPolicy.NONE
                    "
                    label="Wait for connection when offline"
                />
                <checkbox-input
                    v-model="shortcutData.followRedirects"
                    label="Follow redirects"
                />
                <checkbox-input
                    v-model="shortcutData.acceptCookies"
                    label="Store cookies"
                />
                <checkbox-input
                    v-model="shortcutData.acceptAllCertificates"
                    label="Accept any certificate (I know what I'm doing)"
                />

                <!-- TODO: Timeout -->

                <text-input
                    :value="shortcutData.proxyHost || ''"
                    label="Proxy Hostname / IP Address"
                    placeholder="Enter the hostname or IP address of an HTTP proxy"
                    @input="(value) => {
                        shortcutData.proxyHost = value.length > 0 ? value : null;
                    }"
                />
                <text-input
                    :value="shortcutData.proxyPort ? `${shortcutData.proxyPort}` : ''"
                    label="Proxy Port"
                    placeholder="Enter the port of the HTTP proxy"
                    type="number"
                    min="1"
                    max="65353"
                    @input="(value) => {
                        shortcutData.proxyPort = value.length > 0 ? parseInt(value) : null;
                    }"
                />
            </form-section>
        </div>
    </div>
</template>

<script>
import CheckboxInput from '@/components/form/CheckboxInput.vue';
import Chevron from '@/components/basic/Chevron.vue';
import FormSection from '@/components/form/FormSection.vue';
import Icon from '@/components/basic/Icon.vue';
import ScriptInput from '@/components/form/ScriptInput.vue';
import SelectInput from '@/components/form/SelectInput.vue';
import TextInput from '@/components/form/TextInput.vue';
import {
    AuthenticationMethod,
    ExecutionType,
    HttpMethod,
    ResponseHandlingType,
    ResponseHandlingFailureOutputType,
    ResponseHandlingSuccessOutputType,
    RetryPolicy,
} from '@/model';

export default {
    components: {
        CheckboxInput,
        Chevron,
        FormSection,
        Icon,
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
            AuthenticationMethod,
            HttpMethod,
            ResponseHandlingType,
            ResponseHandlingFailureOutputType,
            ResponseHandlingSuccessOutputType,
            RetryPolicy,
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
        shortcutTitleSuffix() {
            switch (this.shortcut.executionType) {
            case ExecutionType.BROWSER:
                return '(Browser Shortcut)';
            case ExecutionType.TRIGGER:
                return '(Multi-Shortcut)';
            case ExecutionType.SCRIPTING:
                return '(Scripting Shortcut)';
            default:
                return null;
            }
        },
        isRegularShortcut() {
            return this.shortcutData.executionType === ExecutionType.APP;
        },
        isBrowserShortcut() {
            return this.shortcutData.executionType === ExecutionType.BROWSER;
        },
        isScriptingShortcut() {
            return this.shortcutData.executionType === ExecutionType.SCRIPTING;
        },
        usesUrl() {
            return this.isRegularShortcut || this.isBrowserShortcut;
        },
        usesUsernameAndPassword() {
            return this.isRegularShortcut
                && (
                    this.shortcutData.authentication === AuthenticationMethod.BASIC
                        || this.shortcutData.authentication === AuthenticationMethod.DIGEST
                );
        },
        usesAuthToken() {
            return this.isRegularShortcut
                && this.shortcutData.authentication === AuthenticationMethod.BEARER;
        },
        usesRequestBody() {
            if (!this.isRegularShortcut) {
                return false;
            }
            const { method } = this.shortcutData;
            return method === HttpMethod.POST
                || method === HttpMethod.PUT
                || method === HttpMethod.DELETE
                || method === HttpMethod.PATCH
                || method === HttpMethod.OPTIONS;
        },
        usesDisplayType() {
            if (!this.isRegularShortcut) {
                return false;
            }
            const { responseHandling } = this.shortcutData;
            return (
                responseHandling.successOutput !== ResponseHandlingSuccessOutputType.NONE
                || responseHandling.failureOutput !== ResponseHandlingFailureOutputType.NONE
            );
        },
        usesSuccessMessage() {
            if (!this.isRegularShortcut) {
                return false;
            }
            const { responseHandling } = this.shortcutData;
            return responseHandling.successOutput === ResponseHandlingSuccessOutputType.MESSAGE;
        },
        usesScriptingBefore() {
            return this.shortcutData.executionType !== ExecutionType.TRIGGER;
        },
        usesScriptingOnSuccess() {
            return this.isRegularShortcut;
        },
        usesScriptingOnFailure() {
            return this.isRegularShortcut;
        },
        isWaitForInternet() {
            return this.isRegularShortcut
                && this.shortcutData.retryPolicy === RetryPolicy.WAIT_FOR_INTERNET;
        },
    },
    methods: {
        toggle() {
            this.expanded = !this.expanded;
        },
        onCopyClicked() {
            this.$emit('copy', this.shortcutData);
        },
        onDeleteClicked() {
            // eslint-disable-next-line no-restricted-globals
            if (confirm('Delete this shortcut?')) {
                this.$emit('delete', this.shortcutData);
            }
        },
    },
};
</script>

<style lang="sass" scoped>
.shortcut
    background: #ffffff
    border: 1px solid #CCCCCC

    &__header
        display: flex
        cursor: pointer
        align-items: center

        &__drag-handle
            width: 24px
            height: 24px
            flex: 0 0 auto
            cursor: move
            padding: 10px
            opacity: 0.25
            transition: opacity ease-in-out 300ms

        &:hover &__drag-handle
            opacity: 1

        &__title
            font-size: 1.4em
            padding: 15px 0
            flex: 1 1 auto

            &__suffix
               color: #CCCCCC

        &__chevron, &__copy-button, &__delete-button
            flex: 0 0 auto
            width: 18px
            height: 18px
            padding: 10px
            opacity: 0.25
            transition: opacity ease-in-out 300ms

        &:hover &__chevron, &:hover &__copy-button, &:hover &__delete-button
            opacity: 1

    &__form
        padding: 0 20px
</style>
