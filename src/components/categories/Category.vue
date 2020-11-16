<template>
    <div class="category">
        <div class="category__header" @click="toggle">
            <div class="category__header__title">
                {{ categoryTitle }}
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
import Chevron from '@/components/Chevron.vue';
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
            const name = this.categoryData.name.length > 0
                ? this.categoryData.name
                : '-';
            return this.categoryData.hidden
                ? `${name} (hidden)`
                : name;
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
    margin: 10px 0 20px

    &__header
        display: flex
        cursor: pointer
        align-items: center

        &__title
            font-size: 2em
            padding: 10px
            flex: 1 1 auto

        &__chevron
            flex: 0 0 auto
            width: 24px
            height: 24px
            margin: 10px

    &__form
        padding: 0 12px

</style>
