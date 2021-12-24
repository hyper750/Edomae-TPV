<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <BreadCrumb />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-dialog v-model="showCreateDialog" @click:outside="resetCreateMealDialog">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="success" v-on="on" v-bind="attrs">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                class="bi bi-plus"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
                                />
                            </svg>
                            {{ $t("Add") }}
                        </v-btn>
                    </template>
                    <MealDialog
                        ref="createMealDialog"
                        @close="closeCreateDialog"
                        @save="saveCreateDialog"
                    />
                </v-dialog>
            </v-col>
        </v-row>

        <v-dialog v-model="showUpdateDialog" eager>
            <MealDialog
                :meal="updateMeal"
                @close="closeUpdateDialog"
                @save="saveUpdateDialog"
                @delete="deleteObjectDialog"
            />
        </v-dialog>

        <v-row>
            <v-col md="4" v-for="meal in meals" :key="meal.id">
                <span @click.stop="() => openUpdateDialog(meal)">
                    <MealObject :meal="meal" />
                </span>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import BreadCrumb from "../components/BreadCrumb";
import MealEndpoints from "../axios/api/meal";
import MealObject from "../components/MealObject";
import MealDialog from "../components/MealDialog";

export default {
    components: {
        BreadCrumb,
        MealObject,
        MealDialog,
    },

    mounted() {
        this.loadMeal();
    },

    data() {
        return {
            meals: [],
            showCreateDialog: false,
            showUpdateDialog: false,
            updateMeal: null,
        };
    },

    methods: {
        loadMeal() {
            MealEndpoints.list()
                .then(({ data }) => (this.meals = data))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Error listing meals")
                    )
                );
        },

        closeCreateDialog() {
            this.showCreateDialog = false;
        },

        saveCreateDialog() {
            this.closeCreateDialog();
            this.loadMeal();
        },

        closeUpdateDialog() {
            this.showUpdateDialog = false;
        },

        saveUpdateDialog() {
            this.closeUpdateDialog();
            this.loadMeal();
        },

        openUpdateDialog(meal) {
            this.updateMeal = meal;
            this.showUpdateDialog = true;
        },

        deleteObjectDialog() {
            this.closeUpdateDialog();
            this.loadMeal();
        },

        resetCreateMealDialog() {
            this.$refs.createMealDialog.close();
        },
    },
};
</script>
