<template>
    <div>
        Command: {{ command }} <br/>
        Meal: {{ meal }}
    </div>
</template>

<script>
export default {
    props: {
        meal: Object,
        command: Object,
    }
};
</script>
