<template>
    <div>
        <label>
            Name:
            <input v-model="shortcutData.name">
        </label>
    </div>
</template>

<script>
export default {
    props: {
        shortcut: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            shortcutData: { ...this.shortcut },
        };
    },
    watch: {
        shortcutData: {
            handler(newData) {
                this.$emit('update:shortcut', newData);
            },
            deep: true,
        },
    },
};
</script>

<style scoped>

</style>
