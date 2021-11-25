<template>
    <v-card>
        <v-card-title>
            {{ $t("Are you sure you want to delete it?") }}
        </v-card-title>

        <v-card-actions>
            <v-spacer/>
            <v-btn color="blue darken-1" text @click="() => deny()">
                {{ $t('Close') }}
            </v-btn>
            <v-btn color="error darken-1" text @click="() => accept()">
                {{ $t('Delete') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    methods: {
        accept() {
            this.$emit("accept");
        },

        deny() {
            this.$emit("deny");
        },
    },
};
</script>
