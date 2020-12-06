<template>
    <div class="variable-options">
        <div
            class="variable-options__item"
            v-for="variable in variables"
            :key="variable.id"
            @click="onVariablePicked(variable)">
            {{ variable.key }}
        </div>
        <span v-if="variables.length === 0" class="variable-options__empty">
            You don't have any variables yet.<br><br>
            Creating variables is currently not possible in this editor.
            Please create them in the app instead.
        </span>
    </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min';

export default {
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

<style lang="sass" scoped>
.variable-options
    margin: 5px 10px
    max-height: 600px
    overflow-y: auto

    &__item
        text-align: center
        font-size: 1.2em
        padding: 10px
        color: #666666
        cursor: pointer
        margin: 5px 0

        &:hover
            color: #0277bd

    &__empty
        color: #4a4a4a
</style>
