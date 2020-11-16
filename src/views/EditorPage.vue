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
            /*
            TODO: Validate input
            - Must have at least 1 non-hidden category
            - Must not have any shortcuts without a name
            - Must not have any categories without a name
            - Must not have any regular or browser shortcuts without a valid URl
             */
            try {
                await this.saveData();
            } catch (e) {
                // TODO
                // eslint-disable-next-line no-alert
                console.log(e);
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
</style>
