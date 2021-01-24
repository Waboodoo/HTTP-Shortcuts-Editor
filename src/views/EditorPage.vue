<template>
    <page v-if="data" class="editor">
        <template #header class="editor__header">
            <div
                :class="[
                    'editor__header__save',
                    {
                        'editor__header__save--visible': hasUnsavedChanges,
                        'editor__header__save--disabled': isSaving,
                    }
                ]"
                @click="onSave"
            >Save Changes</div>
            <span :class="[
                'editor__header__saving',
                {'editor__header__saving--visible': isSaving}
            ]">Saving...</span>
        </template>
        <template #main class="editor__main">
            <div class="editor__main_section-title">Categories</div>
            <category-list
                :categories="data.categories"
                :variables="data.variables"
                @update:categories="onUpdateCategories"
            />

            <div class="editor__main_section-title">Variables</div>
            <variable-list
                :variables="data.variables"
                @update:variables="onUpdateVariables"
            />

            <div class="editor__main_section-title">Global Settings</div>
                <global-settings-form
                    :base="data"
                    :variables="data.variables"
                    @update:base="onUpdateBase"
                />
        </template>
    </page>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

import Vue from 'vue';
import CategoryList from '@/components/categories/CategoryList.vue';
import GlobalSettingsForm from '@/components/global/GlobalSettingsForm.vue';
import Page from '@/views/Page.vue';
import ValidationError from '@/store/errors/ValidationError';
import VariableList from '@/components/variables/VariableList.vue';

export default Vue.extend({
    components: {
        CategoryList,
        GlobalSettingsForm,
        Page,
        VariableList,
    },
    computed: {
        ...mapState([
            'data',
            'hasUnsavedChanges',
            'isSaving',
        ]),
        ...mapGetters([
            'isLoaded',
        ]),
    },
    async mounted() {
        if (this.isLoaded) {
            this.registerOnUnload();
        } else {
            await this.$router.replace('/');
        }
    },
    methods: {
        ...mapActions([
            'setData',
            'saveData',
        ]),
        registerOnUnload() {
            window.addEventListener('beforeunload', (e) => {
                if (!this.hasUnsavedChanges) {
                    return undefined;
                }
                const message = 'You have unsaved changes. '
                    + 'Are you sure you want to leave and discard them?';
                e.returnValue = message;
                return message;
            });
        },
        onUpdateCategories(categories) {
            this.setData({
                ...this.data,
                categories,
            });
        },
        onUpdateVariables(variables) {
            this.setData({
                ...this.data,
                variables,
            });
        },
        onUpdateBase(base) {
            this.setData({
                ...this.data,
                title: base.title,
                globalCode: base.globalCode,
            });
        },
        async onSave() {
            if (!this.hasUnsavedChanges || this.isSaving) {
                return;
            }
            try {
                await this.saveData();
            } catch (e) {
                if (e instanceof ValidationError) {
                    this.$dialog.alert(e.message);
                } else {
                    this.$dialog.alert('An error occurred while trying to save your changes. Please try again.');
                }
            }
        },
    },
});
</script>

<style lang="sass" scoped>
.editor
    &__header
        &__save
            padding: 5px 16px
            border-radius: 3px
            background: #ffffff
            color: #0277bd
            margin: 10px
            opacity: 0
            transition: opacity ease-in-out 0.2s

            &--visible
                cursor: pointer
                opacity: 1

            &--disabled
                cursor: default
                color: #666666
                background: #FAFAFA

        &__saving
            color: #FFFFFF
            margin: 10px
            opacity: 0
            transition: opacity ease-in-out 0.2s

            &--visible
                opacity: 1

    &__main_section-title
        margin-top: 1.5em
        margin-bottom: 0.5em
        font-size: 1.8em
        font-weight: bold

        &:first-child
            margin-top: 0
</style>
