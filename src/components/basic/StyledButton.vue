<template>
    <div class="button" v-on="$listeners">
        <slot />
    </div>
</template>

<style lang="sass" scoped>
.button
    display: inline-block
    cursor: pointer
    padding: 10px 16px
    border-radius: 3px
    background: #666666
    color: #ffffff
    transition: background-color ease-in-out 0.2s

    &:hover
        background: #0277bd
</style>
