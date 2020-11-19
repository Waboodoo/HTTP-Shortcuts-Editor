<template>
    <div :class="['chevron', { 'chevron--expanded': expanded }]"></div>
</template>

<script>
export default {
    props: {
        expanded: {
            type: Boolean,
        },
    },
};
</script>

<style lang="sass" scoped>
.chevron
    background: url('../../assets/chevron-right.svg')

    &--expanded
        background: url('../../assets/chevron-down.svg')
</style>
