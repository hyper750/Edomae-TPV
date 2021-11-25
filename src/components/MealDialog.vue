<template>
    <v-card>
        <v-card-title>{{ $t("Meal") }}</v-card-title>
        <v-card-text>
            <v-container fluid>
                <v-row>
                    <v-col cols="12">
                        <v-checkbox v-model="enabled" :label="$t('Enabled')" />
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            v-model="name"
                            :label="$t('Name')"
                            counter="124"
                            :rules="nameRules"
                        />
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            v-model="description"
                            :label="$t('Description')"
                            counter="2048"
                            :rules="descriptionRules"
                        />
                    </v-col>
                    <v-col cols="6">
                    </v-col>
                    <v-col cols="6">
                    </v-col>
                    <v-col cols="6">
                    </v-col>
                    <v-col cols="6">
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: {
        meal: Object,
    },

    data() {
        return {
            enabled: true,
            name: "",
            nameRules: [
                (f) => f.length <= 124 || this.$t("Max 124 characters"),
                (f) =>
                    f.length !== 0 ||
                    this.$t("At least a character is required"),
            ],
            description: "",
            descriptionRules: [
                (f) => f.length <= 2048 || this.$t("Max 2048 characters"),
                (f) =>
                    f.length !== 0 ||
                    this.$t("At least a character is required"),
            ],
        };
    },
};
</script>
