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

        <styled-button
            class="category-list__add-button"
            @click="addNewCategory"
        >
            Add New Category
        </styled-button>
    </div>
</template>

<script>
import Category from '@/components/categories/Category.vue';
import draggable from 'vuedraggable';
import StyledButton from '@/components/basic/StyledButton.vue';
import { createNewCategory } from '@/model';

export default {
    components: {
        Category,
        draggable,
        StyledButton,
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
        addNewCategory() {
            this.categoriesData.push(createNewCategory());
        },
    },
};
</script>

<style lang="sass" scoped>
.category-list
    &__item
        margin: 10px 0 20px

        &:first-child
            margin-top: 0

        &:last-child
            margin-bottom: 0

    &__add-button
        margin: 20px 0
</style>
