<template>
    <selection-dialog
        title="Add New Shortcut"
        :selection-options="selectionOptions"
        :get-option-id="(option) => option.type"
        :get-option-label="(option) => option.label"
        @option-selected="onOptionPicked"
    />
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min';
import SelectionDialog from '@/components/basic/SelectionDialog.vue';
import { ExecutionType } from '@/model';

export default {
    components: {
        SelectionDialog,
    },
    mixins: [DialogMixin],
    computed: {
        selectionOptions() {
            return [
                {
                    type: ExecutionType.APP,
                    label: 'Regular HTTP Shortcut',
                },
                {
                    type: ExecutionType.BROWSER,
                    label: 'Browser Shortcut',
                },
                // TODO: Add support for trigger shortcut
                {
                    type: ExecutionType.SCRIPTING,
                    label: 'Scripting Shortcut',
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
