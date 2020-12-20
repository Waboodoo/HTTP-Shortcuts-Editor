<template>
    <div class="variable-list">
        <draggable
            v-model="variablesData"
            group="variables"
            handle=".variable__header__drag-handle"
        >
            <variable
                v-for="variable in variablesData"
                :key="variable.id"
                :variable="variable"
                :variables="variables"
                class="variable-list__item"
                @update:variable="onUpdate"
                @delete="onDelete"
            />
            <template slot="footer">
                <div v-if="variablesData.length === 0" class="empty-state">
                    No variables defined
                </div>
            </template>
        </draggable>

        <styled-button
            class="variable-list__add-button"
            @click="addNewVariable"
        >
            Add New Variable
        </styled-button>
    </div>
</template>

<script>
import Variable from '@/components/variables/Variable.vue';
import draggable from 'vuedraggable';
import StyledButton from '@/components/basic/StyledButton.vue';
import { createNewVariable } from '@/model';

export default {
    components: {
        Variable,
        draggable,
        StyledButton,
    },
    props: {
        variables: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            variablesData: [...this.variables],
        };
    },
    watch: {
        variablesData(newData) {
            this.$emit('update:variables', newData);
        },
    },
    methods: {
        onUpdate(variable) {
            this.variablesData = this.variablesData.map(
                (s) => (s.id === variable.id ? variable : s),
            );
        },
        onDelete(variable) {
            this.variablesData = this.variablesData.filter((s) => s.id !== variable.id);
        },
        async addNewVariable() {
            this.variablesData.push(createNewVariable());
        },
    },
};
</script>

<style lang="sass" scoped>
.empty-state
    color: #4a4a4a
    padding: 5px 0

.variable-list
    &__item
        margin: 10px 0 20px

        &:first-child
            margin-top: 0

        &:last-child
            margin-bottom: 0

    &__add-button
        margin-top: 20px
</style>
