<template>
    <div v-if="shortcuts.length > 0" class="shortcut-list">
        <shortcut
            v-for="shortcut in shortcuts"
            :key="shortcut.id"
            :shortcut="shortcut"
            @update:shortcut="onUpdate"
        />
    </div>
    <div v-else class="empty-state">
        This category contains no shortcuts.
    </div>
</template>

<script>
import Shortcut from '@/components/shortcuts/Shortcut.vue';

export default {
    components: {
        Shortcut,
    },
    props: {
        shortcuts: {
            type: Array,
            required: true,
        },
    },
    methods: {
        onUpdate(shortcut) {
            this.$emit(
                'update:shortcuts',
                this.shortcuts.map((s) => (s.id === shortcut.id ? shortcut : s)),
            );
        },
    },
};
</script>

<style lang="sass" scoped>
.empty-state
    color: #4a4a4a
</style>
