<template>
    <div class="category-list">
        <draggable
            v-model="categoriesData"
            group="categories"
            handle=".category__header__drag-handle"
        >
            <category
                 v-for="category in categoriesData"
                 :key="category.id"
                 :category="category"
                 :allow-deletion="categoriesData.length > 1"
                 class="category-list__item"
                 @update:category="onUpdate"
                 @delete="onDelete"
            />
        </draggable>
    </div>
</template>

<script>
import Category from '@/components/categories/Category.vue';
import draggable from 'vuedraggable';

export default {
    components: {
        Category,
        draggable,
    },
    props: {
        categories: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            categoriesData: [...this.categories],
        };
    },
    watch: {
        categoriesData(newData) {
            this.$emit('update:categories', newData);
        },
    },
    methods: {
        onUpdate(category) {
            this.categoriesData = this.categoriesData.map(
                (c) => (c.id === category.id ? category : c),
            );
        },
        onDelete(category) {
            this.categoriesData = this.categoriesData.filter((c) => c.id !== category.id);
        },
    },
};
</script>

<style lang="sass" scoped>
.category-list__item
    margin: 10px 0 20px

    &:first-child
        margin-top: 0
</style>
