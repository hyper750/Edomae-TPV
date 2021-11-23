<template>
    <v-row>
        <v-col md="12">
            <v-breadcrumbs :items="getItems" />
        </v-col>
    </v-row>
</template>

<script>
export default {
    computed: {
        getItems() {
            return this.$route.meta.breadcrumb;
        },
    },
};
</script>
