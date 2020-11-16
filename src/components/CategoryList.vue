<template>
    <div class="category-list">
        <category
             v-for="category in categories"
             :key="category.id"
             :category="category"
             @update:category="onUpdate"
        />
    </div>
</template>

<script>
import Category from '@/components/Category.vue';

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
.category-list
    background: #F0F0F0
</style>
