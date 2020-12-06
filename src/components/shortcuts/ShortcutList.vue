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
                :variables="variables"
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
import Vue from 'vue';
import Shortcut from '@/components/shortcuts/Shortcut.vue';
import draggable from 'vuedraggable';
import StyledButton from '@/components/basic/StyledButton.vue';
import { cloneShortcut, createNewShortcut } from '@/model';
import ShortcutTypePicker from '@/components/shortcuts/ShortcutTypePicker.vue';

const DIALOG_NAME = 'shortcut-type-picker';

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
        variables: {
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
    created() {
        Vue.dialog.registerComponent(DIALOG_NAME, ShortcutTypePicker);
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
        async addNewShortcut() {
            try {
                const choice = await this.$dialog.confirm('', {
                    view: DIALOG_NAME,
                    html: true,
                    animation: 'fade',
                    backdropClose: true,
                });
                this.shortcutsData.push(createNewShortcut(choice.data.type));
            } catch (e) {
                // cancelled
            }
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
        margin-top: 20px
</style>
