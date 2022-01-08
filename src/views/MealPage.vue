<template>
    <v-container fluid>
        <v-row>
            <v-col md="12">
                <BreadCrumb />
            </v-col>
        </v-row>

        <v-row>
            <v-col md="1">
                <v-dialog
                    v-model="showCreateDialog"
                    @click:outside="resetCreateMealDialog"
                >
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
                        :lastMealOrder="getLastMealOrder"
                        ref="createMealDialog"
                        @close="closeCreateDialog"
                        @save="saveCreateDialog"
                    />
                </v-dialog>
            </v-col>
            <v-col md="2">
                <v-select
                    v-model="selectedMealCategory"
                    :items="getMealCategories"
                    :label="$t('Meal category')"
                    @change="onMealCategoryChange"
                />
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
import MealCategoryEndpoints from "../axios/api/mealCategory";

export default {
    components: {
        BreadCrumb,
        MealObject,
        MealDialog,
    },

    mounted() {
        this.loadMealCategories();
        this.loadMeal(this.selectedMealCategory);
    },

    data() {
        return {
            meals: [],
            showCreateDialog: false,
            showUpdateDialog: false,
            updateMeal: null,
            mealCategories: [],
            selectedMealCategory: null,
        };
    },

    computed: {
        getLastMealOrder() {
            const orders = this.meals.map(({ order }) => order);

            if (orders.length === 0) {
                return 0;
            }

            return Math.max(...orders);
        },

        getMealCategories() {
            const mealCategories = this.mealCategories.map((d) => {
                let name = d.name;

                if (!d.enabled) {
                    name += ` (${this.$i18n.t("disabled")})`;
                }

                return {
                    text: name,
                    value: d.id,
                };
            });
            mealCategories.unshift({
                text: this.$i18n.t("All meal categories"),
                value: null,
            });
            return mealCategories;
        },
    },

    methods: {
        loadMealCategories() {
            MealCategoryEndpoints.list()
                .then(({ data }) => (this.mealCategories = data))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load meal categories")
                    )
                );
        },

        loadMeal(mealCategoryId) {
            MealEndpoints.list({
                category: mealCategoryId
            })
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
            this.loadMeal(this.selectedMealCategory);
        },

        closeUpdateDialog() {
            this.showUpdateDialog = false;
        },

        saveUpdateDialog() {
            this.closeUpdateDialog();
            this.loadMeal(this.selectedMealCategory);
        },

        openUpdateDialog(meal) {
            this.updateMeal = meal;
            this.showUpdateDialog = true;
        },

        deleteObjectDialog() {
            this.closeUpdateDialog();
            this.loadMeal(this.selectedMealCategory);
        },

        resetCreateMealDialog() {
            this.$refs.createMealDialog.close();
        },

        onMealCategoryChange(newMealCategory) {
            this.loadMeal(newMealCategory);
        },
    },
};
</script>
