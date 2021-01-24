<template>
    <div class="global-settings">
        <text-input
            v-model="baseData.title"
            :label="$t('base.title.label')"
            :placeholder="$t('base.title.placeholder')"
        />

        <with-variable-picker
            :variables="variables"
            @variable-picked="
                (variable) => this.$refs.globalScriptInput.insertVariable(variable)
            "
        >
            <script-input
                ref="globalScriptInput"
                v-model="baseData.globalCode"
                :label="$t('base.globalCode.label')"
                :placeholder="$t('base.globalCode.placeholder')"
            />
        </with-variable-picker>
    </div>
</template>

<script>
import ScriptInput from '@/components/form/ScriptInput.vue';
import TextInput from '@/components/form/TextInput.vue';
import WithVariablePicker from '@/components/variables/WithVariablePicker.vue';

export default {
    components: {
        ScriptInput,
        TextInput,
        WithVariablePicker,
    },
    props: {
        base: {
            type: Object,
            required: true,
        },
        variables: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            baseData: { ...this.base },
        };
    },
    watch: {
        baseData: {
            handler(newData) {
                this.$emit('update:base', newData);
            },
            deep: true,
        },
    },
};
</script>

<style lang="sass" scoped>
.global-settings
    background: #fafafa
    border: 1px solid #CCCCCC
    padding: 20px

    ::v-deep .script-input__editor
        background-color: #FFFFFF
</style>
