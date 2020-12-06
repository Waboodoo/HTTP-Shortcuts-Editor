<template>
    <div class="picker-wrapper">
        <slot></slot>
        <variable-picker-button
            class="picker-wrapper__button"
            :variables="variables"
            @variable-picked="onVariablePicked"
        />
    </div>
</template>

<script>
import VariablePickerButton from '@/components/variables/VariablePickerButton.vue';

export default {
    components: {
        VariablePickerButton,
    },
    props: {
        variables: {
            type: Array,
            required: true,
        },
    },
    methods: {
        onVariablePicked(variable) {
            this.$emit('variable-picked', variable);
            this.$emit('insert-text', `{{{${variable.key}}}}`);
        },
    },
};
</script>

<style lang="sass" scoped>
.picker-wrapper
    display: flex

    &__button
        flex: 0 0 auto
        margin-top: 1em
</style>
