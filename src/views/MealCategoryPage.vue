<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <BreadCrumb />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-btn type="button" color="success">
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
            </v-col>
        </v-row>

        <v-row class="mt-2">
            <v-col
                md="4"
                v-for="mealCategory in mealCategories"
                :key="mealCategory.id"
            >
                <MealCategoryObject
                    :mealCategory="mealCategory"
                    @delete="loadMealCategory()"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import BreadCrumb from "../components/BreadCrumb";
import MealCategoryEndpoints from "../axios/api/mealCategory";
import MealCategoryObject from "../components/MealCategoryObject.vue";

export default {
    components: {
        BreadCrumb,
        MealCategoryObject,
    },

    data() {
        return {
            mealCategories: [],
        };
    },

    mounted() {
        this.loadMealCategory();
    },

    methods: {
        loadMealCategory() {
            MealCategoryEndpoints.list().then(
                ({ data }) => (this.mealCategories = data)
            );
        },
    },
};
</script>
