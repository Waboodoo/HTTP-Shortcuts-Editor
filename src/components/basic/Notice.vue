<template>
    <div class="notice">
        <slot />
    </div>
</template>

<script>
export default {
};
</script>

<style lang="sass" scoped>
.notice
    background: #fafafa
    color: #4a4a4a
    border: 1px solid #CCCCCC
    padding: 0 20px
    font-size: 0.9em
    line-height: 1.3em
</style>
