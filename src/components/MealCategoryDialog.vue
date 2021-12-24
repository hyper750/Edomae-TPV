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
                        v-on="on"
                        v-bind="attrs"
                        color="error darken-1"
                        text
                        v-show="mealCategory"
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
import DeleteConfirmDialog from "./DeleteConfirmDialog.vue";

export default {
    props: {
        mealCategory: {
            type: Object,
        },
        lastMealCategoryOrder: {
            type: Number
        }
    },

    components: {
        DeleteConfirmDialog,
    },

    data() {
        return {
            deleteDialog: false,

            enabled: true,

            name: "",
            nameRules: [
                (f) => f.length <= 250 || this.$t("Max 250 characters"),
                (f) =>
                    f.length !== 0 ||
                    this.$t("At least a character is required"),
            ],

            order: this.getDefaultOrder(),
            orderRules: [
                (f) =>
                    f.length !== 0 || this.$t("Put an order for the category"),
            ],

            imatge: null,
            imatgeRules: [
                (f) =>
                    (f !== null && f.length !== 0) ||
                    this.$i18n.t("An imatge is required"),
            ],
        };
    },

    watch: {
        mealCategory: function (newValue) {
            this.enabled = newValue.enabled;
            this.name = newValue.name;
            this.order = newValue.order;
            // this.imatge = newValue.imatge;
        },
    },

    methods: {
        getDefaultOrder() {
            return (this.lastMealCategoryOrder)? this.lastMealCategoryOrder + 1 : 1;
        },

        resetForm() {
            // Reset form attributes only if is create mode
            if(this.mealCategory) {
                return;
            }
            this.enabled = true;
            this.name = "";
            this.order = this.getDefaultOrder();
            this.imatge = null;
        },

        close() {
            this.resetForm();
            this.$emit("close");
        },

        async save() {
            const mealCategoryUpdate = {
                enabled: this.enabled,
                name: this.name,
                order: this.order,
                imatge: this.imatge,
            };
            // Save or create
            if (this.mealCategory) {
                // Update
                await MealCategoryEndpoints.put(
                    this.mealCategory.id,
                    mealCategoryUpdate
                ).catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Error updating meal categories")
                    )
                );
            } else {
                // Create
                await MealCategoryEndpoints.post(mealCategoryUpdate).catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Error saving meal categories")
                    )
                );
            }

            this.resetForm();
            this.$emit("save");
        },

        async deleteObject() {
            await MealCategoryEndpoints.delete(this.mealCategory.id).catch(() =>
                this.$store.dispatch(
                    "setGlobalError",
                    this.$i18n.t("Error deleting the meal category")
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
    },
};
</script>
