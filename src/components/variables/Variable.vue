<template>
    <div class="variable">
        <div class="variable__header" @click="toggle">
            <icon class="variable__header__drag-handle" name="drag-handle" />
            <div class="variable__header__title">
                {{ variableTitle }}
                <span
                    class="variable__header__title__suffix"
                >({{ variableType }})</span>
            </div>
            <icon
                class="variable__header__delete-button"
                name="delete"
                title="Delete Variable"
                @click.stop="onDeleteClicked"
            />
            <chevron
                :expanded="expanded"
                class="variable__header__chevron"
            />
        </div>
        <div v-if="expanded" class="variable__form">
            <text-input
                ref="keyInput"
                v-model="variableData.key"
                label="Name"
                placeholder="Enter the name for this variable"
                maxlength="30"
            />
            <with-variable-picker
                v-if="variableData.type === VariableType.CONSTANT"
                :variables="variables"
                @insert-text="(text) => this.$refs.valueInput.insertAtCursor(text)"
            >
                <text-input
                    ref="valueInput"
                    v-model="variableData.value"
                    label="Value"
                    maxlength="30000"
                    placeholder="Enter the value for this variable"
                    :multiline="true"
                />
            </with-variable-picker>
        </div>
    </div>
</template>

<script>
import Chevron from '@/components/basic/Chevron.vue';
import Icon from '@/components/basic/Icon.vue';
import TextInput from '@/components/form/TextInput.vue';
import WithVariablePicker from '@/components/variables/WithVariablePicker.vue';
import { VariableType } from '@/model';

export default {
    components: {
        Chevron,
        Icon,
        TextInput,
        WithVariablePicker,
    },
    props: {
        variable: {
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
            expanded: false,
            variableData: { ...this.variable },
            VariableType,
        };
    },
    watch: {
        variableData: {
            handler(newData) {
                this.variableData = newData;
                this.variableData.key = newData.key.replace(/[^A-Za-z0-9_]/g, '');
                this.$emit('update:variable', this.variableData);
            },
            deep: true,
        },
    },
    computed: {
        variableTitle() {
            return this.variableData.key.length > 0
                ? this.variableData.key
                : '-';
        },
        variableType() {
            switch (this.variableData.type) {
            case VariableType.TEXT:
                return 'Text Input';
            case VariableType.NUMBER:
                return 'Number Input';
            case VariableType.PASSWORD:
                return 'Password Input';
            case VariableType.SELECT:
                return 'Multiple Choice Selection';
            case VariableType.TOGGLE:
                return 'Toggle';
            case VariableType.COLOR:
                return 'Color Input';
            case VariableType.DATE:
                return 'Date Input';
            case VariableType.TIME:
                return 'Time Input';
            case VariableType.SLIDER:
                return 'Number Slider';
            default:
                return 'Static Variable';
            }
        },
    },
    methods: {
        toggle() {
            this.expanded = !this.expanded;
        },
        async onDeleteClicked() {
            try {
                await this.$dialog.confirm('Delete this variable?', {
                    okText: 'Delete',
                });
                this.$emit('delete', this.variableData);
            } catch (e) {
                // cancelled
            }
        },
    },
};
</script>

<style lang="sass" scoped>
.variable
    background: #ffffff
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
            font-size: 1.2em
            padding: 15px 0
            flex: 1 1 auto

            &__suffix
                color: #CCCCCC

        &__chevron, &__delete-button
            flex: 0 0 auto
            width: 18px
            height: 18px
            padding: 10px
            opacity: 0.25
            transition: opacity ease-in-out 300ms

        &:hover &__chevron, &:hover &__delete-button
            opacity: 1

    &__form
        padding: 0 20px
</style>
