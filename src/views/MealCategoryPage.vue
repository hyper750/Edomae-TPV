<template>
    <SideNavBarPage>
        <v-container fluid class="mt-2">
            <BreadCrumb page="Meal Category" />
            <v-row>
                <v-col md="12">
                    <v-btn
                        type="button"
                        color="success"
                        data-toggle="modal"
                        data-target="#mealCategory"
                    >
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
                    <MealCategoryModal
                        :mealCategory="mealCategoryClicked"
                        @save="loadMealCategory()"
                        @close="resetMealCategoryClicked()"
                    />
                </v-col>
            </v-row>
            <v-row class="mt-2">
                <v-col
                    md="4"
                    v-for="mealCategory in mealCategories"
                    :key="mealCategory.id"
                >
                    <MealCategoryObject :mealCategory="mealCategory" @click="() => setMealCategoryClicked(mealCategory)" @delete="loadMealCategory()" />
                </v-col>
            </v-row>
        </v-container>
    </SideNavBarPage>
</template>

<script>
import { ref } from "vue";
import SideNavBarPage from "../components/SideNavBarPage.vue";
import BreadCrumb from "../components/BreadCrumb";
import MealCategoryObject from "../components/MealCategoryObject";
import MealCategoryEndpoints from "../axios/api/mealCategory";
import MealCategoryModal from "../components/MealCategoryModal.vue";
import { onMounted } from "vue";

export default {
    components: {
        SideNavBarPage,
        BreadCrumb,
        MealCategoryObject,
        MealCategoryModal,
    },

    setup() {
        const mealCategoryClicked = ref(null);
        const { load, mealCategory } = MealCategoryEndpoints.list();
        const loadMealCategory = async () => {
            await load();
        };

        const setMealCategoryClicked = (mealCategoryObject) => mealCategoryClicked.value = mealCategoryObject;
        const resetMealCategoryClicked = () => {
            mealCategoryClicked.value = null;
        };

        onMounted(loadMealCategory);

        return {
            mealCategories: mealCategory,
            loadMealCategory,
            setMealCategoryClicked,
            mealCategoryClicked,
            resetMealCategoryClicked,
        };
    },
};
</script>
