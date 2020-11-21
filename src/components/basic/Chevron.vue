<template>
    <icon :name="expanded ? 'chevron-down' : 'chevron-right'"/>
</template>

<script>
import Icon from '@/components/basic/Icon.vue';

export default {
    components: {
        Icon,
    },
    props: {
        expanded: {
            type: Boolean,
        },
    },
};
</script>
