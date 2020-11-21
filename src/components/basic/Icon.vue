<template>
    <div class="icon" v-on="$listeners">
        <div class="icon__icon" :style="style" />
    </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    computed: {
        style() {
            return {
                'background-image': `url('assets/icons/${this.name}.svg')`,
            };
        },
    },
};
</script>

<style lang="sass" scoped>
.icon
    box-sizing: content-box

    &__icon
        width: 100%
        height: 100%
        background-repeat: no-repeat
        background-position: center
</style>
