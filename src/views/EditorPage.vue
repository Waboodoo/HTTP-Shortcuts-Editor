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

            <a
                href="https://http-shortcuts.rmy.ch/documentation"
                target="_blank"
                class="editor__header__documentation-link"
            >Documentation</a>

        </template>
        <template #main class="editor__main">
            <category-list
                :categories="data.categories"
                @update:categories="onUpdateCategories"
            />
        </template>
    </page>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

import Vue from 'vue';
import CategoryList from '@/components/categories/CategoryList.vue';
import Page from '@/views/Page.vue';
import ValidationError from '@/store/errors/ValidationError';

export default Vue.extend({
    components: {
        CategoryList,
        Page,
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
        if (!this.isLoaded) {
            await this.$router.replace('/');
        }
    },
    methods: {
        ...mapActions([
            'loadData',
            'setData',
            'saveData',
        ]),
        onUpdateCategories(categories) {
            this.setData({
                ...this.data,
                categories,
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
                    // eslint-disable-next-line no-alert
                    alert(e.message);
                } else {
                    // eslint-disable-next-line no-alert
                    alert('An error occurred while trying to save your changes. Please try again.');
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

        &__documentation-link
            display: block
            margin-left: auto
            padding: 5px 16px
            color: #fafafa
            text-decoration: none
</style>
