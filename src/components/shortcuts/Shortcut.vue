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
                <with-variable-picker
                    v-if="usesUrl"
                    :variables="variables"
                    @insert-text="(text) => this.$refs.urlInput.insertAtCursor(text)"
                >
                    <text-input
                        ref="urlInput"
                        v-model="shortcutData.url"
                        label="URL"
                        placeholder="Enter a URL for this shortcut"
                    />
                </with-variable-picker>
            </form-section>

            <form-section v-if="isRegularShortcut" title="Request Headers">
                <header-list
                    :headers="shortcutData.headers"
                    :variables="variables"
                    @update:headers="onUpdateHeaders"
                />
            </form-section>

            <form-section v-if="usesRequestBody" title="Request Body / Parameters">
                <select-input
                    v-model="shortcutData.requestBodyType"
                    label="Request Body Type"
                    :options="[
                        {
                            value: RequestBodyType.FORM_DATA,
                            label: 'Parameters (form-data)',
                        },
                        {
                            value: RequestBodyType.X_WWW_FORM_URLENCODE,
                            label: 'Parameters (x-www-form-urlencoded)',
                        },
                        {
                            value: RequestBodyType.CUSTOM_TEXT,
                            label: 'Custom Text',
                        },
                        {
                            value: RequestBodyType.FILE,
                            label: 'File (Picker)',
                        },
                    ]"
                />
                <text-input
                    v-if="usesCustomTextRequestBody"
                    v-model="shortcutData.contentType"
                    label="Content-Type"
                    placeholder="Enter the type of your request body, e.g., application/json"
                />
                <with-variable-picker
                    v-if="usesCustomTextRequestBody"
                    :variables="variables"
                    @insert-text="(text) => this.$refs.bodyInput.insertAtCursor(text)"
                >
                    <text-input
                        ref="bodyInput"
                        v-model="shortcutData.bodyContent"
                        label="Request Body"
                        placeholder="Enter the request body, e.g., a JSON object"
                        :multiline="true"
                    />
                </with-variable-picker>
                <parameter-list
                    v-if="usesParameters"
                    :parameters="shortcutData.parameters"
                    :variables="variables"
                    :supports-files="shortcutData.requestBodyType === RequestBodyType.FORM_DATA"
                    @update:parameters="onUpdateParameters"
                />
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
                <with-variable-picker
                    v-if="usesUsernameAndPassword"
                    :variables="variables"
                    @insert-text="(text) => this.$refs.usernameInput.insertAtCursor(text)"
                >
                    <text-input
                        ref="usernameInput"
                        v-model="shortcutData.username"
                        label="Username"
                        placeholder="Enter a username"
                    />
                </with-variable-picker>
                <with-variable-picker
                    v-if="usesUsernameAndPassword"
                    :variables="variables"
                    @insert-text="(text) => this.$refs.passwordInput.insertAtCursor(text)"
                >
                    <text-input
                        ref="passwordInput"
                        v-model="shortcutData.password"
                        label="Password"
                        placeholder="Enter a password"
                    />
                </with-variable-picker>
                <with-variable-picker
                    v-if="usesAuthToken"
                    :variables="variables"
                    @insert-text="(text) => this.$refs.tokenInput.insertAtCursor(text)"
                >
                    <text-input
                        ref="tokenInput"
                        v-model="shortcutData.authToken"
                        label="Token"
                        placeholder="Enter a token"
                    />
                </with-variable-picker>
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

                <with-variable-picker
                    v-if="usesSuccessMessage"
                    :variables="variables"
                    @insert-text="(text) => this.$refs.successMessageInput.insertAtCursor(text)"
                >
                    <text-input
                        ref="successMessage"
                        v-model="shortcutData.responseHandling.successMessage"
                        label="Message"
                        placeholder="Shortcut executed."
                    />
                </with-variable-picker>

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

            <form-section v-if="usesScripting" title="Scripting">
                <template slot="header">
                    See the <a href="https://http-shortcuts.rmy.ch/scripting" target="_blank">Scripting documentation</a> for more information.
                </template>
                <template>
                    <with-variable-picker
                        :variables="variables"
                        @variable-picked="
                            (variable) => this.$refs.scriptPrepareInput.insertVariable(variable)
                        "
                    >
                        <script-input
                            ref="scriptPrepareInput"
                            v-model="shortcutData.codeOnPrepare"
                            label="Run before Execution"
                            :placeholder="
                                isScriptingShortcut
                                ? 'Add JavaScript code here'
                                : 'Add JavaScript code here to run before the shortcut is ' +
                                 'executed, e.g., to prepare some variables.'
                            "
                        />
                    </with-variable-picker>
                    <with-variable-picker
                        v-if="usesScriptingOnSuccess"
                        :variables="variables"
                        @variable-picked="
                            (variable) => this.$refs.scriptSuccessInput.insertVariable(variable)
                        "
                    >
                        <script-input
                            ref="scriptSuccessInput"
                            v-model="shortcutData.codeOnSuccess"
                            label="Run after Execution"
                            :placeholder="'Add JavaScript code here to run after the shortcut is ' +
                                'executed, e.g., to process the response.'"
                        />
                    </with-variable-picker>
                    <with-variable-picker
                        v-if="usesScriptingOnFailure"
                        :variables="variables"
                        @variable-picked="
                            (variable) => this.$refs.scriptFailureInput.insertVariable(variable)
                        "
                    >
                        <script-input
                            ref="scriptFailureInput"
                            v-model="shortcutData.codeOnFailure"
                            label="Run on Failure"
                            placeholder="Add JavaScript code here to run in case the request fails."
                        />
                    </with-variable-picker>
                </template>
                <!-- TODO: Code Snippet Picker -->
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
                <text-input
                    :value="`${shortcutData.delay}`"
                    label="Delay (in milliseconds)"
                    type="number"
                    min="0"
                    max="600000"
                    @input="(value) => {
                        shortcutData.delay = parseInt(value);
                    }"
                />
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
                <text-input
                    :value="`${shortcutData.timeout}`"
                    label="Timeout (in milliseconds)"
                    type="number"
                    min="500"
                    max="600000"
                    @input="(value) => {
                        shortcutData.timeout = parseInt(value);
                    }"
                />
                <with-variable-picker
                    :variables="variables"
                    @insert-text="(text) => this.$refs.proxyInput.insertAtCursor(text)"
                >
                    <text-input
                        ref="proxyInput"
                        :value="shortcutData.proxyHost || ''"
                        label="Proxy Hostname / IP Address"
                        placeholder="Enter the hostname or IP address of an HTTP proxy"
                        @input="(value) => {
                            shortcutData.proxyHost = value.length > 0 ? value : null;
                        }"
                    />
                </with-variable-picker>
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
import HeaderList from '@/components/shortcuts/headers/HeaderList.vue';
import Icon from '@/components/basic/Icon.vue';
import ParameterList from '@/components/shortcuts/parameters/ParameterList.vue';
import ScriptInput from '@/components/form/ScriptInput.vue';
import SelectInput from '@/components/form/SelectInput.vue';
import TextInput from '@/components/form/TextInput.vue';
import WithVariablePicker from '@/components/variables/WithVariablePicker.vue';
import {
    AuthenticationMethod,
    ExecutionType,
    HttpMethod,
    RequestBodyType,
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
        HeaderList,
        Icon,
        ParameterList,
        ScriptInput,
        SelectInput,
        TextInput,
        WithVariablePicker,
    },
    props: {
        shortcut: {
            type: Object,
            required: true,
        },
        variables: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            expanded: false,
            shortcutData: { ...this.shortcut },
            AuthenticationMethod,
            HttpMethod,
            RequestBodyType,
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
        usesCustomTextRequestBody() {
            if (!this.isRegularShortcut) {
                return false;
            }
            return this.shortcutData.requestBodyType === RequestBodyType.CUSTOM_TEXT;
        },
        usesParameters() {
            if (!this.isRegularShortcut) {
                return false;
            }
            return this.shortcutData.requestBodyType === RequestBodyType.FORM_DATA
                || this.shortcutData.requestBodyType === RequestBodyType.X_WWW_FORM_URLENCODE;
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
        usesScripting() {
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
        onUpdateHeaders(headers) {
            this.$emit('update:shortcut', {
                ...this.shortcut,
                headers,
            });
        },
        onUpdateParameters(parameters) {
            this.$emit('update:shortcut', {
                ...this.shortcut,
                parameters,
            });
        },
        toggle() {
            this.expanded = !this.expanded;
        },
        onCopyClicked() {
            this.$emit('copy', this.shortcutData);
        },
        async onDeleteClicked() {
            try {
                await this.$dialog.confirm('Delete this shortcut?', {
                    okText: 'Delete',
                });
                this.$emit('delete', this.shortcutData);
            } catch (e) {
                // cancelled
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
