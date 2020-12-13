<template>
    <div class="parameter-list">
        <draggable
            v-model="parametersData"
            :group="`parameters${supportsFiles ? '--with-files' : ''}`"
            handle=".parameter__header__drag-handle"
        >
            <parameter
                v-for="parameter in parametersData"
                :key="parameter.id"
                :parameter="parameter"
                :variables="variables"
                class="parameter-list__item"
                @update:parameter="onUpdate"
                @delete="onDelete"
            />
            <template slot="footer">
                <div v-if="parametersData.length === 0" class="empty-state">
                    No parameters defined
                </div>
            </template>
        </draggable>

        <styled-button
            class="parameter-list__add-button"
            @click="addNewParameter"
        >
            Add New Parameter
        </styled-button>
    </div>
</template>

<script>
import Vue from 'vue';
import Parameter from '@/components/shortcuts/parameters/Parameter.vue';
import ParameterTypePicker from '@/components/shortcuts/parameters/ParameterTypePicker.vue';
import draggable from 'vuedraggable';
import StyledButton from '@/components/basic/StyledButton.vue';
import { createNewParameter, ParameterType } from '@/model';

const DIALOG_NAME = 'parameter-type-picker';

export default {
    components: {
        Parameter,
        draggable,
        StyledButton,
    },
    props: {
        parameters: {
            type: Array,
            required: true,
        },
        variables: {
            type: Array,
            required: true,
        },
        supportsFiles: {
            type: Boolean,
        },
    },
    data() {
        return {
            parametersData: [...this.parameters],
        };
    },
    watch: {
        parametersData(newData) {
            this.$emit('update:parameters', newData);
        },
    },
    created() {
        Vue.dialog.registerComponent(DIALOG_NAME, ParameterTypePicker);
    },
    methods: {
        onUpdate(parameter) {
            this.parametersData = this.parametersData.map(
                (s) => (s.id === parameter.id ? parameter : s),
            );
        },
        onDelete(parameter) {
            this.parametersData = this.parametersData.filter((s) => s.id !== parameter.id);
        },
        async addNewParameter() {
            if (this.supportsFiles) {
                try {
                    const choice = await this.$dialog.confirm('', {
                        view: DIALOG_NAME,
                        html: true,
                        animation: 'fade',
                        backdropClose: true,
                    });
                    this.parametersData.push(createNewParameter(choice.data.type));
                } catch (e) {
                    // cancelled
                }
            } else {
                this.parametersData.push(createNewParameter(ParameterType.STRING));
            }
        },
    },
};
</script>

<style lang="sass" scoped>
.empty-state
    color: #4a4a4a
    padding: 5px 0

.parameter-list
    &__item
        margin: 10px 0 20px

        &:first-child
            margin-top: 0

        &:last-child
            margin-bottom: 0

    &__add-button
        margin-top: 20px
</style>
