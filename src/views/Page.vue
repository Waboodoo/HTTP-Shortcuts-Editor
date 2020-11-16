<template>
    <div class="page">
        <header class="page__header">
            <slot name="header" />
        </header>
        <main class="page__main">
            <slot name="main" />
        </main>
    </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
});
</script>

<style lang="sass" scoped>
.page
    &__header
        display: flex
        position: fixed
        background: #0277BD
        height: 50px
        top: 0
        left: 0
        right: 0
        width: 100%
        align-items: center
        z-index: 1

    &__main
        margin-top: 50px
        padding: 10px
</style>
