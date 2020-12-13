<template>
    <selection-dialog
        title="Add New Parameter"
        :selection-options="selectionOptions"
        :get-option-id="(option) => option.type"
        :get-option-label="(option) => option.label"
        @option-selected="onOptionPicked"
    />
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min';
import SelectionDialog from '@/components/basic/SelectionDialog.vue';
import { ParameterType } from '@/model';

export default {
    components: {
        SelectionDialog,
    },
    mixins: [DialogMixin],
    computed: {
        selectionOptions() {
            return [
                {
                    type: ParameterType.STRING,
                    label: 'String (default)',
                },
                {
                    type: ParameterType.FILE,
                    label: 'Single File',
                },
                {
                    type: ParameterType.FILES,
                    label: 'Multiple Files',
                },
            ];
        },
    },
    methods: {
        onOptionPicked(option) {
            this.proceed(option);
        },
    },
};
</script>
