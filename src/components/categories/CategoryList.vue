<template>
    <div class="category-list">
        <category
             v-for="category in categories"
             :key="category.id"
             :category="category"
             class="category-list__item"
             @update:category="onUpdate"
        />
    </div>
</template>

<script>
import Category from '@/components/categories/Category.vue';

export default {
    components: {
        Category,
    },
    props: {
        categories: {
            type: Array,
            required: true,
        },
    },
    methods: {
        onUpdate(category) {
            this.$emit(
                'update:categories',
                this.categories.map((c) => (c.id === category.id ? category : c)),
            );
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
