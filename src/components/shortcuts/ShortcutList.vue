<template>
    <div class="shortcut-list">
        <draggable
            v-model="shortcutsData"
            group="shortcuts"
            handle=".shortcut__header__drag-handle"
        >
            <shortcut
                v-for="shortcut in shortcutsData"
                :key="shortcut.id"
                :shortcut="shortcut"
                class="shortcut-list__item"
                @update:shortcut="onUpdate"
                @copy="onCopy"
                @delete="onDelete"
            />
            <template slot="footer">
                <div v-if="shortcutsData.length === 0" class="empty-state">
                    This category contains no shortcuts.
                </div>
            </template>
        </draggable>

        <styled-button
            class="shortcut-list__add-button"
            @click="addNewShortcut"
        >
            Add New Shortcut
        </styled-button>
    </div>
</template>

<script>
import Shortcut from '@/components/shortcuts/Shortcut.vue';
import draggable from 'vuedraggable';
import StyledButton from '@/components/basic/StyledButton.vue';
import { cloneShortcut, createNewShortcut } from '@/model';

export default {
    components: {
        Shortcut,
        draggable,
        StyledButton,
    },
    props: {
        shortcuts: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            shortcutsData: [...this.shortcuts],
        };
    },
    watch: {
        shortcutsData(newData) {
            this.$emit('update:shortcuts', newData);
        },
    },
    methods: {
        onUpdate(shortcut) {
            this.shortcutsData = this.shortcutsData.map(
                (s) => (s.id === shortcut.id ? shortcut : s),
            );
        },
        onCopy(shortcut) {
            const copy = cloneShortcut(shortcut);
            copy.name = `${shortcut.name} (copy)`;
            const index = this.shortcutsData.findIndex((s) => s.id === shortcut.id);
            if (index === -1) {
                return;
            }
            this.shortcutsData.splice(index + 1, 0, copy);
        },
        onDelete(shortcut) {
            this.shortcutsData = this.shortcutsData.filter((s) => s.id !== shortcut.id);
        },
        addNewShortcut() {
            this.shortcutsData.push(createNewShortcut());
        },
    },
};
</script>

<style lang="sass" scoped>
.empty-state
    color: #4a4a4a
    padding: 5px 0

.shortcut-list
    &__item
        margin: 10px 0 20px

        &:first-child
            margin-top: 0

        &:last-child
            margin-bottom: 0

    &__add-button
        margin: 20px 0
</style>
