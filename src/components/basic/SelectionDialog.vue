<template>
    <div class="dialog">
        <div class="dialog__title">{{ title }}</div>
        <div class="dialog__options">
            <div
                class="dialog__options__item"
                v-for="option in selectionOptions"
                :key="getOptionId(option)"
                @click="onOptionSelected(option)">
                {{ getOptionLabel(option) }}
            </div>
            <span v-if="selectionOptions.length === 0" class="dialog__options__empty">
                <slot name="empty"></slot>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        selectionOptions: {
            type: Array,
            required: true,
        },
        getOptionLabel: {
            type: Function,
            required: true,
        },
        getOptionId: {
            type: Function,
            default: (option) => option.id,
        },
    },
    methods: {
        onOptionSelected(option) {
            this.$emit('option-selected', option);
        },
    },
};
</script>

<style lang="sass" scoped>
.dialog
    margin: 5px

    &__title
        font-size: 1.5em
        margin: 5px 5px 0.5em
        font-weight: bold

    &__options
        max-height: 600px
        overflow-y: auto

        &__item
            font-size: 1.2em
            padding: 10px 5px
            color: #666666
            cursor: pointer
            margin: 5px 0

            &:hover
                color: #0277bd

        &__empty
            color: #4a4a4a
</style>
