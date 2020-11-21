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
            />
            <template slot="footer">
                <div v-if="shortcutsData.length === 0" class="empty-state">
                    This category contains no shortcuts.
                </div>
            </template>
        </draggable>
    </div>
</template>

<script>
import Shortcut from '@/components/shortcuts/Shortcut.vue';
import draggable from 'vuedraggable';

export default {
    components: {
        Shortcut,
        draggable,
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
            this.$emit(
                'update:shortcuts',
                this.shortcutsData.map((s) => (s.id === shortcut.id ? shortcut : s)),
            );
        },
    },
};
</script>

<style lang="sass" scoped>
.empty-state
    color: #4a4a4a

.shortcut-list__item
    margin: 10px 0 20px

    &:first-child
        margin-top: 0
</style>
