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
    },
};
</script>
