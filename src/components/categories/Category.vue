<template>
    <div class="category">
        <div class="category__header" @click="toggle">
            <div class="category__header__drag-handle" />
            <div class="category__header__title">
                {{ categoryTitle }}
                <span
                    v-if="categoryData.hidden"
                    class="category__header__title__suffix"
                >(hidden)</span>
            </div>
            <chevron
                :expanded="expanded"
                class="category__header__chevron"
            />
        </div>
        <div v-if="expanded" class="category__form">
            <text-input
                v-if="expanded"
                v-model="categoryData.name"
                label="Category Name"
                placeholder="Enter a name for this category"
            />
            <checkbox-input
                v-model="categoryData.hidden"
                label="Hidden"
            />
            <select-input
                v-model="categoryData.layoutType"
                label="Layout Type"
                :options="[
                    { value: 'linear_list', label: 'List' },
                    { value: 'grid', label: 'Grid' },
                ]"
            />
            <labelled label="Shortcuts">
                <shortcut-list
                    :shortcuts="category.shortcuts"
                    @update:shortcuts="onUpdate"
                />
            </labelled>
        </div>
    </div>
</template>

<script>
import CheckboxInput from '@/components/form/CheckboxInput.vue';
import Chevron from '@/components/basic/Chevron.vue';
import Labelled from '@/components/form/Labelled.vue';
import SelectInput from '@/components/form/SelectInput.vue';
import ShortcutList from '@/components/shortcuts/ShortcutList.vue';
import TextInput from '@/components/form/TextInput.vue';

export default {
    components: {
        CheckboxInput,
        Chevron,
        Labelled,
        SelectInput,
        ShortcutList,
        TextInput,
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
    computed: {
        categoryTitle() {
            return this.categoryData.name.length > 0
                ? this.categoryData.name
                : '-';
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
.category
    background: #fafafa
    border: 1px solid #CCCCCC

    &__header
        display: flex
        cursor: pointer
        align-items: center

        &__drag-handle
            width: 24px
            height: 24px
            background: url('../../assets/drag-handle.svg')
            flex: 0 0 auto
            cursor: move
            margin: 10px
            opacity: 0.25

        &:hover &__drag-handle
            opacity: 1

        &__title
            font-size: 2em
            padding: 15px 0
            flex: 1 1 auto

            &__suffix
                color: #CCCCCC

        &__chevron
            flex: 0 0 auto
            width: 24px
            height: 24px
            margin: 10px
            opacity: 0.25

        &:hover &__chevron
            opacity: 1

    &__form
        padding: 0 20px

</style>
