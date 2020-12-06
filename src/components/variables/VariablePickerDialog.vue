<template>
    <selection-dialog
        title="Insert Variable"
        :selection-options="variables"
        :get-option-label="(option) => option.key"
        @option-selected="onVariablePicked"
    >
        <template #empty>
            You don't have any variables yet.<br><br>
            Creating variables is currently not possible in this editor.
            Please create them in the app instead.
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
