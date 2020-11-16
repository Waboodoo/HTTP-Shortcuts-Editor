<template>
    <div class="category">
        <div class="category__header">
            <label>
                Category Name:
                <input v-model="categoryData.name">
            </label>
            <div class="category__header__chevron" @click="toggle"></div>
        </div>
        <shortcut-list
            v-if="expanded"
            :shortcuts="category.shortcuts"
            @update:shortcuts="onUpdate"
        />
    </div>
</template>

<script>
import ShortcutList from '@/components/ShortcutList.vue';

export default {
    components: {
        ShortcutList,
    },
    props: {
        category: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            expanded: false,
            categoryData: { ...this.category },
        };
    },
    watch: {
        categoryData: {
            handler(newData) {
                this.$emit('update:category', newData);
            },
            deep: true,
        },
    },
    methods: {
        onUpdate(shortcuts) {
            this.$emit('update:category', {
                ...this.category,
                shortcuts,
            });
        },
        toggle() {
            this.expanded = !this.expanded;
        },
    },
};
</script>

<style lang="sass" scoped>
.category__header
    &__chevron
        float: right
        width: 10px
        height: 10px
        background: black
</style>
