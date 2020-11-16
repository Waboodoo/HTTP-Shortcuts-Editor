<template>
    <div v-if="data" class="editor">
        <header class="editor__header">
            <div
                v-if="hasUnsavedChanges"
                class="editor__header__save"
                @click="onSave"
            >Save Changes</div>
        </header>
        <main class="editor__main">
            <category-list
                :categories="data.categories"
                @update:categories="onUpdateCategories"
            />
        </main>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

import Vue from 'vue';
import CategoryList from '@/components/categories/CategoryList.vue';

export default Vue.extend({
    components: {
        CategoryList,
    },
    computed: {
        ...mapState(['data', 'hasUnsavedChanges']),
        ...mapGetters(['isLoaded']),
    },
    async mounted() {
        if (!this.isLoaded) {
            await this.$router.replace('/');
        }
    },
    methods: {
        ...mapActions(['loadData', 'setData', 'saveData']),
        onUpdateCategories(categories) {
            this.setData({
                ...this.data,
                categories,
            });
        },
        async onSave() {
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
                alert(e);
            }
        },
    },
});
</script>

<style lang="sass" scoped>
.editor
    &__header
        display: flex
        position: fixed
        background: #0277BD
        height: 50px
        top: 0
        left: 0
        right: 0
        width: 100%
        align-items: center
        z-index: 1

        &__save
            cursor: pointer
            padding: 5px 16px
            border-radius: 3px
            background: #ffffff
            color: #0277bd
            margin: 10px

    &__main
        margin-top: 50px
        padding: 10px
</style>
