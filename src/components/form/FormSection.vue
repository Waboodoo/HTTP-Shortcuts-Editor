<template>
    <div class="form-section">
        <div class="form-section__title">{{ title }}</div>
        <div class="form-section__header">
            <slot name="header"></slot>
        </div>
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
    },
};
</script>

<style lang="sass" scoped>
.form-section
    &__title
        font-size: 1.2em
        margin: 2em 0 0.5em
        color: #0277bd

    &__header
        margin: 0.7em 0 1em
        color: #4a4a4a

        &:empty
            display: none

        a
            text-decoration: none
            color: #0277bd
</style>
