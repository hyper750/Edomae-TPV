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
                        <v-text-field
                            v-model="price"
                            :label="$t('Price')"
                            type="number"
                            :rules="priceRules"
                        />
                    </v-col>
                    <v-col cols="6">
                        <v-select
                            :items="categories"
                            v-model="category"
                            :label="$t('Category')"
                            :rules="categoryRules"
                        />
                    </v-col>
                    <v-col cols="6">
                        <v-text-field
                            v-model="order"
                            :label="$t('Order')"
                            type="number"
                            :rules="orderRules"
                        />
                    </v-col>
                    <v-col cols="6">
                        <v-file-input
                            v-model="imatge"
                            :label="$t('Imatge')"
                            accept="image/*"
                            :rules="imatgeRules"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>

        <v-card-actions>
            <v-dialog v-model="deleteDialog" eager>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="error darken-1"
                        text
                        v-show="meal"
                        v-on="on"
                        v-bind="attrs"
                    >
                        {{ $t("Delete") }}
                    </v-btn>
                </template>
                <DeleteConfirmDialog
                    @accept="acceptConfirmDialog"
                    @deny="closeConfirmDialog"
                />
            </v-dialog>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="close()">
                {{ $t("Close") }}
            </v-btn>
            <v-btn color="blue darken-1" text @click="save()">
                {{ $t("Save") }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import DeleteConfirmDialog from "./DeleteConfirmDialog.vue";
import MealEndpoints from "../axios/api/meal";
import MealCategoryEndpoints from "../axios/api/mealCategory";

export default {
    props: {
        meal: Object,
    },

    components: {
        DeleteConfirmDialog,
    },

    mounted() {
        this.loadCategories();
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

            order: 1,
            orderRules: [
                (f) => f.length !== 0 || this.$t("Put an order for the meal"),
            ],

            categories: [],
            category: null,
            categoryRules: [
                (f) =>
                    (f !== null && f.length !== 0) ||
                    this.$i18n.t("A category is required"),
            ],

            imatge: null,
            imatgeRules: [
                (f) =>
                    (f !== null && f.length !== 0) ||
                    this.$i18n.t("An imatge is required"),
            ],

            price: "1.0",
            priceRules: [
                (f) => f.length !== 0 || this.$t("Put a price for the meal"),
                (f) =>
                    parseFloat(f) >= 0.01 ||
                    this.$t("The price must be positive"),
            ],

            deleteDialog: false,
        };
    },

    watch: {
        meal: function (newValue) {
            this.enabled = newValue.enabled;
            this.name = newValue.name;
            this.description = newValue.description;
            this.order = newValue.order;
            // this.imatge = newValue.imatge;
            this.price = newValue.price;
            this.category = newValue.category;
        },
    },

    methods: {
        resetForm() {
            // Reset form attributes only if is create mode
            if(this.meal) {
                return;
            }

            this.enabled = true;
            this.name = "";
            this.description = "";
            this.order = 1;
            this.imatge = null;
            this.price = "1.0";
            this.category = null;
        },

        close() {
            this.resetForm();
            this.$emit("close");
        },

        async save() {
            const mealUpdate = {
                enabled: this.enabled,
                name: this.name,
                description: this.description,
                order: this.order,
                imatge: this.imatge,
                price: this.price,
                category: this.category,
            };
            if (this.meal) {
                // Update
                await MealEndpoints.put(this.meal.id, mealUpdate).catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Error updating the meal")
                    )
                );
            } else {
                // Create
                await MealEndpoints.post(mealUpdate).catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Error creating the meal")
                    )
                );
            }
            this.resetForm();
            this.$emit("save");
        },

        async deleteObject() {
            await MealEndpoints.delete(this.meal.id).catch(() =>
                this.$store.dispatch(
                    "setGlobalError",
                    this.$i18n.t("Error deleting the meal")
                )
            );
            this.resetForm();
            this.$emit("delete");
        },

        async acceptConfirmDialog() {
            this.closeConfirmDialog();
            await this.deleteObject();
        },

        closeConfirmDialog() {
            this.deleteDialog = false;
        },

        async loadCategories() {
            await MealCategoryEndpoints.list()
                .then(
                    ({ data }) =>
                        (this.categories = data.map((category) => ({
                            text: category.name,
                            value: category.id,
                        })))
                )
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Error getting category meals")
                    )
                );
        },
    },
};
</script>
