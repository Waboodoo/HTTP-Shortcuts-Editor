<template>
    <div class="category">
        <div class="category__header" @click="toggle">
            <icon class="category__header__drag-handle" name="drag-handle" />
            <div class="category__header__title">
                {{ categoryTitle }}
                <span
                    v-if="categoryData.hidden"
                    class="category__header__title__suffix"
                >(hidden)</span>
            </div>
            <icon
                v-if="allowDeletion"
                class="category__header__delete-button"
                name="delete"
                title="Delete Category"
                @click.stop="onDeleteClicked"
            />
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
import Icon from '@/components/basic/Icon.vue';
import SelectInput from '@/components/form/SelectInput.vue';
import ShortcutList from '@/components/shortcuts/ShortcutList.vue';
import TextInput from '@/components/form/TextInput.vue';

export default {
    components: {
        CheckboxInput,
        Chevron,
        Labelled,
        Icon,
        SelectInput,
        ShortcutList,
        TextInput,
    },
    props: {
        category: {
            type: Object,
            required: true,
        },
        allowDeletion: {
            type: Boolean,
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
        async onDeleteClicked() {
            try {
                await this.$dialog.confirm('Delete this category and all its shortcuts?', {
                    okText: 'Delete',
                    cancelText: 'Cancel',
                });
                this.$emit('delete', this.categoryData);
            } catch (e) {
                // cancelled
            }
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
            flex: 0 0 auto
            cursor: move
            padding: 10px
            opacity: 0.25
            transition: opacity ease-in-out 300ms

        &:hover &__drag-handle
            opacity: 1

        &__title
            font-size: 2em
            padding: 15px 0
            flex: 1 1 auto

            &__suffix
                color: #CCCCCC

        &__chevron, &__delete-button
            flex: 0 0 auto
            width: 24px
            height: 24px
            padding: 10px
            opacity: 0.25
            transition: opacity ease-in-out 300ms

        &:hover &__chevron, &:hover &__delete-button
            opacity: 1

    &__form
        padding: 0 20px

</style>
