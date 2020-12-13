<template>
    <div class="parameter">
        <div class="parameter__header" @click="toggle">
            <icon class="parameter__header__drag-handle" name="drag-handle" />
            <div class="parameter__header__title">
                {{ parameterTitle }}
            </div>
            <icon
                class="parameter__header__delete-button"
                name="delete"
                title="Delete Parameter"
                @click.stop="onDeleteClicked"
            />
            <chevron
                :expanded="expanded"
                class="parameter__header__chevron"
            />
        </div>
        <div v-if="expanded" class="parameter__form">
            <with-variable-picker
                :variables="variables"
                @insert-text="(text) => this.$refs.keyInput.insertAtCursor(text)"
            >
                <text-input
                    ref="keyInput"
                    v-model="parameterData.key"
                    label="Name"
                    placeholder="Enter the name for this parameter"
                />
            </with-variable-picker>
            <with-variable-picker
                v-if="parameterData.type === ParameterType.STRING"
                :variables="variables"
                @insert-text="(text) => this.$refs.valueInput.insertAtCursor(text)"
            >
                <text-input
                    ref="valueInput"
                    v-model="parameterData.value"
                    label="Value"
                    placeholder="Enter the value for this parameter"
                />
            </with-variable-picker>
            <text-input
                v-if="parameterData.type === ParameterType.FILE"
                v-model="parameterData.fileName"
                label="File Name (optional)"
                placeholder="Enter the file name for this parameter"
            />
        </div>
    </div>
</template>

<script>
import Chevron from '@/components/basic/Chevron.vue';
import Icon from '@/components/basic/Icon.vue';
import TextInput from '@/components/form/TextInput.vue';
import WithVariablePicker from '@/components/variables/WithVariablePicker.vue';
import { ParameterType } from '@/model';

export default {
    components: {
        Chevron,
        Icon,
        TextInput,
        WithVariablePicker,
    },
    props: {
        parameter: {
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
            parameterData: { ...this.parameter },
            ParameterType,
        };
    },
    watch: {
        parameterData: {
            handler(newData) {
                this.$emit('update:parameter', newData);
            },
            deep: true,
        },
    },
    computed: {
        parameterTitle() {
            return this.parameterData.key.length > 0
                ? `${this.parameterData.key}: ${this.parameterValue}`
                : '-';
        },
        parameterValue() {
            switch (this.parameterData.type) {
            case ParameterType.FILE:
                return '(File)';
            case ParameterType.FILES:
                return '(Files)';
            default:
                return this.parameterData.value;
            }
        },
    },
    methods: {
        toggle() {
            this.expanded = !this.expanded;
        },
        async onDeleteClicked() {
            try {
                await this.$dialog.confirm('Delete this parameter?', {
                    okText: 'Delete',
                });
                this.$emit('delete', this.parameterData);
            } catch (e) {
                // cancelled
            }
        },
    },
};
</script>

<style lang="sass" scoped>
.parameter
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
