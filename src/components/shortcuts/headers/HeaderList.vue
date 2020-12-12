<template>
    <div class="header-list">
        <draggable
            v-model="headersData"
            group="headers"
            handle=".header__header__drag-handle"
        >
            <shortcut-header
                v-for="header in headersData"
                :key="header.id"
                :header="header"
                :variables="variables"
                class="header-list__item"
                @update:header="onUpdate"
                @delete="onDelete"
            />
            <template slot="footer">
                <div v-if="headersData.length === 0" class="empty-state">
                    No headers defined
                </div>
            </template>
        </draggable>

        <styled-button
            class="header-list__add-button"
            @click="addNewHeader"
        >
            Add New Header
        </styled-button>
    </div>
</template>

<script>
import ShortcutHeader from '@/components/shortcuts/headers/Header.vue';
import draggable from 'vuedraggable';
import StyledButton from '@/components/basic/StyledButton.vue';
import { createNewHeader } from '@/model';

export default {
    components: {
        ShortcutHeader,
        draggable,
        StyledButton,
    },
    props: {
        headers: {
            type: Array,
            required: true,
        },
        variables: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            headersData: [...this.headers],
        };
    },
    watch: {
        headersData(newData) {
            this.$emit('update:headers', newData);
        },
    },
    methods: {
        onUpdate(header) {
            this.headersData = this.headersData.map(
                (s) => (s.id === header.id ? header : s),
            );
        },
        onDelete(header) {
            this.headersData = this.headersData.filter((s) => s.id !== header.id);
        },
        async addNewHeader() {
            this.headersData.push(createNewHeader());
        },
    },
};
</script>

<style lang="sass" scoped>
.empty-state
    color: #4a4a4a
    padding: 5px 0

.header-list
    &__item
        margin: 10px 0 20px

        &:first-child
            margin-top: 0

        &:last-child
            margin-bottom: 0

    &__add-button
        margin-top: 20px
</style>
