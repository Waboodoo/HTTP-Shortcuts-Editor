<template>
    <div class="shortcut-list">
        <shortcut
            v-for="shortcut in shortcuts"
            :key="shortcut.id"
            :shortcut="shortcut"
            @update:shortcut="onUpdate"
        />
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
