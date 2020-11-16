<template>
    <div v-if="data">
        <header class="header">
            <button v-if="hasUnsavedChanges" @click="onSave">Save</button>
        </header>
        <main class="main">
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
import CategoryList from '@/components/CategoryList.vue';

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
            try {
                const savedShortcuts = await this.saveData();
                // eslint-disable-next-line no-alert
                alert(savedShortcuts);
            } catch (e) {
                // eslint-disable-next-line no-alert
                alert(e);
            }
        },
    },
});
</script>

<style lang="sass" scoped>
.header
    position: fixed
    background: #0277BD
    height: 50px
    top: 0
    left: 0
    right: 0
    width: 100%

.main
    margin-top: 50px
    padding: 10px
</style>
