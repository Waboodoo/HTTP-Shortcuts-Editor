<template>
    <icon
        class="variable-picker-button"
        name="variables"
        title="Insert Variable"
        @click="openPicker"
    />
</template>

<script>
import Vue from 'vue';
import Icon from '@/components/basic/Icon.vue';
import VariablePickerDialog from '@/components/variables/VariablePickerDialog.vue';

const DIALOG_NAME = 'variable-picker';

export default {
    components: {
        Icon,
    },
    props: {
        variables: {
            type: Array,
            required: true,
        },
    },
    created() {
        Vue.dialog.registerComponent(DIALOG_NAME, VariablePickerDialog);
    },
    methods: {
        async openPicker() {
            try {
                const choice = await this.$dialog.confirm('', {
                    view: DIALOG_NAME,
                    html: true,
                    animation: 'fade',
                    backdropClose: true,
                    variables: this.variables,
                });
                this.onVariablePicked(choice.data);
            } catch (e) {
                // cancelled
            }
        },
        onVariablePicked(variable) {
            this.$emit('variable-picked', variable);
        },
    },
};
</script>

<style lang="sass" scoped>
.variable-picker-button
    width: 24px
    height: 24px
    padding: 10px
    opacity: 0.25
    transition: opacity ease-in-out 300ms
    cursor: pointer

    &:hover
        opacity: 1
</style>
