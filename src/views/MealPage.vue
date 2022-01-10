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

        <draggable
            class="row"
            group="meal"
            @start="drag = true"
            @end="drag = false"
            v-model="meals"
            @update="(event) => onMealChange(event)"
        >
            <v-col md="4" v-for="meal in meals" :key="meal.id">
                <span @click.stop="() => openUpdateDialog(meal)">
                    <MealObject :meal="meal" />
                </span>
            </v-col>
        </draggable>
    </v-container>
</template>

<script>
import BreadCrumb from "../components/BreadCrumb";
import MealEndpoints from "../axios/api/meal";
import MealObject from "../components/MealObject";
import MealDialog from "../components/MealDialog";
import MealCategoryEndpoints from "../axios/api/mealCategory";
import draggable from "vuedraggable";

export default {
    components: {
        draggable,
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
                category: mealCategoryId,
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

        onMealChange(event) {
            const newIndex = event.newIndex;
            const oldIndex = event.oldIndex;

            // Update current element position
            // And on the backend shift the other elements between the position updated
            let newOrder;
            if (oldIndex < newIndex) {
                newOrder = (newIndex - 1 >= 0) ? this.meals[newIndex - 1].order : 1;
            } else {
                newOrder = (newIndex + 1 < this.meals.length) ? this.meals[newIndex + 1].order : this.meals.length;
            }

            MealEndpoints.put(this.meals[newIndex].id, {
                order: newOrder,
            })
                .then(() => this.loadMeal(this.selectedMealCategory))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't update the meal")
                    )
                );
        },
    },
};
</script>
