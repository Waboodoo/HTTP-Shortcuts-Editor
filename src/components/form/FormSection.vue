<template>
    <div class="form-section">
        <div class="form-section__title">{{ title }}</div>
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
.form-section__title
    font-size: 1.2em
    margin: 2em 0 0.5em
    color: #0277bd
</style>
