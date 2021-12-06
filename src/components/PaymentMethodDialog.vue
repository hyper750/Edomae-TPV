<template>
    <v-card>
        <v-card-title>{{ $t("Payment method") }}</v-card-title>
        <v-card-text>
            <v-container fluid>
                <v-row>
                    <v-col md="12">
                        <v-checkbox v-model="enabled" :label="$t('Enabled')" />
                    </v-col>
                    <v-col md="6">
                        <v-text-field
                            v-model="name"
                            :label="$t('Name')"
                            counter="124"
                            :rules="nameRules"
                        />
                    </v-col>
                    <v-col md="6">
                        <v-file-input
                            v-model="image"
                            :label="$t('Image')"
                            accept="image/*"
                            :imageRules="imageRules"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions> </v-card-actions>
    </v-card>
</template>
<script>
export default {
    props: {
        paymentMethod: Object,
    },

    data() {
        return {
            enabled: true,

            name: "",
            nameRules: [
                (f) => f.length <= 124 || this.$t("Max 124 caracters"),
                (f) =>
                    f.length > 0 || this.$t("At least a character is required"),
            ],

            image: null,
            imageRules: [
                (f) =>
                    (f !== null && f.length > 0) ||
                    this.$i18n.t("An imatge is required"),
            ],
        };
    },
};
</script>
