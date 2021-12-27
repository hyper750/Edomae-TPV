<template>
    <v-container fluid class="py-0">
        <!-- Select a category -->
        <v-row v-if="!selectedCategory">
            <v-col
                md="3"
                v-for="mealCategory in categories"
                :key="mealCategory.id"
            >
                <v-hover v-slot="{ hover }">
                    <v-card
                        class="cursor-pointer mb-4"
                        :class="{
                            'elevation-12': hover,
                            'elevation-6': !hover,
                        }"
                        @click="() => selectCategory(mealCategory)"
                    >
                        <v-img
                            :src="mealCategory.imatge"
                            height="150"
                            :class="{ disabledOpacity: !mealCategory.enabled }"
                        />

                        <v-card-title>
                            {{ mealCategory.name }}
                        </v-card-title>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>

        <!-- Select meal -->
        <v-row v-else>
            <v-col md="12">
                <v-btn text @click="() => setSelectedCategories(null)">
                    <v-icon>
                        mdi-chevron-left
                    </v-icon>
                    {{ $t("Meal categories") }}
                </v-btn>
            </v-col>
            <v-col md="3" v-for="meal in getMealByCategory" :key="meal.id">
                <v-hover v-slot="{ hover }">
                    <v-card
                        class="cursor-pointer mb-4"
                        :class="{
                            'elevation-12': hover,
                            'elevation-6': !hover,
                        }"
                        @click="() => selectMeal(meal)"
                    >
                        <v-img
                            :src="meal.imatge"
                            height="150"
                            :class="{ disabledOpacity: !meal.enabled }"
                        />

                        <v-card-title>
                            <v-row no-gutters>
                                <v-col cols="10">
                                    {{ meal.name }}
                                </v-col>
                                <v-col cols="2 text-right">
                                    {{ meal.price }}&euro;
                                </v-col>
                            </v-row>
                        </v-card-title>
                        <v-card-text>
                            <div>
                                {{ meal.description }}
                            </div>
                        </v-card-text>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import MealCategoryEndpoints from "../axios/api/mealCategory";

export default {
    props: {
        meals: Array,
    },

    data() {
        return {
            categories: [],
            selectedCategory: null,
        };
    },

    mounted() {
        MealCategoryEndpoints.list({ enabled: true })
            .then(({ data }) => (this.categories = data))
            .catch(() =>
                this.$store.dispath(
                    "setGlobalError",
                    this.$i18n.t("Can't load meal category endpoints")
                )
            );
    },

    computed: {
        getMealByCategory() {
            return this.meals.filter(
                ({ category }) => category === this.selectedCategory
            );
        },
    },

    methods: {
        selectCategory(category) {
            this.selectedCategory = category.id;
        },

        setSelectedCategories(category) {
            this.selectedCategory = category;
        },

        selectMeal(meal) {
            // TODO:
            console.log(meal);
            // TODO: Show a dialog with the total number of articles to apply, extra and discount
        },

        reset() {
            this.selectedCategory = null;
        },
    },
};
</script>
