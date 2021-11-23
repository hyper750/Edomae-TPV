<template>
    <v-card>
        <v-card-title>
            {{ $t("Meal category") }}
        </v-card-title>
        <v-card-text>
            <v-container fluid>
                <v-row>
                    <v-col cols="12">
                        <v-checkbox :label="$t('Enabled')" v-model="enabled" />
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            :label="$t('Name')"
                            v-model="name"
                            :counter="250"
                            :rules="nameRules"
                        />
                    </v-col>
                    <v-col cols="6">
                        <v-text-field
                            type="number"
                            :label="$t('Order')"
                            v-model="order"
                            :rules="orderRules"
                        />
                    </v-col>
                    <v-col cols="6">
                        <v-file-input
                            accept="image/*"
                            :label="$t('Imatge')"
                            v-model="imatge"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="close()" color="blue darken-1" text>
                {{ $t("Close") }}
            </v-btn>
            <v-btn @click="save()" color="blue darken-1" text>
                {{ $t("Save") }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import MealCategoryEndpoints from "../axios/api/mealCategory";

export default {
    props: {
        mealCategory: {
            type: Object,
        },
    },

    data() {
        return {
            enabled: true,
            name: "",
            nameRules: [
                (f) => f.length <= 250 || this.$t("Max 250 characters"),
                (f) =>
                    f.length !== 0 ||
                    this.$t("At least a character is required"),
            ],
            order: 1,
            orderRules: [
                (f) =>
                    f.length !== 0 || this.$t("Put an order for the category"),
            ],
            imatge: null,
        };
    },

    methods: {
        resetForm() {
            this.enabled = true;
            this.name = '';
            this.order = 1;
            this.imatge = null;
        },

        setData() {},

        close() {
            this.resetForm();
            this.$emit("close");
        },

        async save() {
            // Save or create
            if(this.mealCategory) {
                // Update
            }
            else {
                // Create
                await MealCategoryEndpoints.post({
                    enabled: this.enabled,
                    name: this.name,
                    order: this.order,
                    imatge: this.imatge
                });
            }

            this.resetForm();
            this.$emit("save");
        },
    },
};
</script>
