<template>
    <selection-dialog
        title="Insert Variable"
        :selection-options="variables"
        :get-option-label="(option) => option.key"
        @option-selected="onVariablePicked"
    >
        <template #empty>
            You don't have any variables yet. Scroll to the bottom of the page to find the
            button to create variables.
        </template>
    </selection-dialog>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min';
import SelectionDialog from '@/components/basic/SelectionDialog.vue';

export default {
    components: {
        SelectionDialog,
    },
    mixins: [DialogMixin],
    computed: {
        variables() {
            return this.options.variables;
        },
    },
    methods: {
        onVariablePicked(variable) {
            this.proceed(variable);
        },
    },
};
</script>
