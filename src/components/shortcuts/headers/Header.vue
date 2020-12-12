<template>
    <div class="header">
        <div class="header__header" @click="toggle">
            <icon class="header__header__drag-handle" name="drag-handle" />
            <div class="header__header__title">
                {{ headerTitle }}
            </div>
            <icon
                class="header__header__delete-button"
                name="delete"
                title="Delete Header"
                @click.stop="onDeleteClicked"
            />
            <chevron
                :expanded="expanded"
                class="header__header__chevron"
            />
        </div>
        <div v-if="expanded" class="header__form">
            <with-variable-picker
                :variables="variables"
                @insert-text="(text) => this.$refs.keyInput.insertAtCursor(text)"
            >
                <text-input
                    ref="keyInput"
                    v-model="headerData.key"
                    label="Name"
                    placeholder="Enter the name for this header"
                />
            </with-variable-picker>
            <with-variable-picker
                :variables="variables"
                @insert-text="(text) => this.$refs.valueInput.insertAtCursor(text)"
            >
                <text-input
                    ref="valueInput"
                    v-model="headerData.value"
                    label="Value"
                    placeholder="Enter the value for this header"
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

export default {
    components: {
        Chevron,
        Icon,
        TextInput,
        WithVariablePicker,
    },
    props: {
        header: {
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
            headerData: { ...this.header },
        };
    },
    watch: {
        headerData: {
            handler(newData) {
                this.$emit('update:header', newData);
            },
            deep: true,
        },
    },
    computed: {
        headerTitle() {
            return this.headerData.key.length > 0
                ? `${this.headerData.key}: ${this.headerData.value}`
                : '-';
        },
    },
    methods: {
        toggle() {
            this.expanded = !this.expanded;
        },
        async onDeleteClicked() {
            try {
                await this.$dialog.confirm('Delete this header?', {
                    okText: 'Delete',
                });
                this.$emit('delete', this.headerData);
            } catch (e) {
                // cancelled
            }
        },
    },
};
</script>

<style lang="sass" scoped>
.header
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
