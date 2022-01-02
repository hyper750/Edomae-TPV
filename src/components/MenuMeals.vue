<template>
    <v-container fluid class="py-0">
        <!-- Select a category -->
        <v-row v-if="mustShowCategory">
            <v-col
                md="4"
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
                            <p class="text-truncate">
                                {{ mealCategory.name }}
                            </p>
                        </v-card-title>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>

        <!-- Select meal -->
        <v-row v-else>
            <v-col md="12">
                <v-btn text @click="() => setSelectedCategories(null)">
                    <v-icon> mdi-chevron-left </v-icon>
                    {{ $t("Meal categories") }}
                </v-btn>
            </v-col>
            <v-col md="4" v-for="meal in getMealByCategory" :key="meal.id">
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
                                <v-col md="8">
                                    <p class="text-truncate">{{ meal.name }}</p>
                                </v-col>
                                <v-col md="4">
                                    <p class="text-right">{{ meal.price }}&euro;</p>
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

        <!-- Select command meal -->
        <v-dialog
            v-model="showMealCommandDialog"
            @click:outside="resetMealCommandDialog"
            width="unset"
        >
            <CommandMealDialog
                :meal="selectedMeal"
                :command="command"
                @close="resetMealCommandDialog"
            />
        </v-dialog>
    </v-container>
</template>

<script>
import MealCategoryEndpoints from "../axios/api/mealCategory";
import CommandMealDialog from "../components/CommandMealDialog";

export default {
    props: {
        meals: Array,
        command: Object,
    },

    components: {
        CommandMealDialog,
    },

    data() {
        return {
            categories: [],
            selectedCategory: null,
            selectedMeal: null,
            showMealCommandDialog: false,
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

        mustShowCategory() {
            return !this.selectedCategory && !this.selectedMeal;
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
            // Create command if not exists
            if (!this.command) {
                this.$emit("createCommand");
            }
            this.selectedMeal = meal;
            this.showMealCommandDialog = true;
        },

        reset() {
            this.selectedCategory = null;
        },

        resetMealCommandDialog() {
            this.showMealCommandDialog = null;
            this.selectedMeal = null;
        },
    },
};
</script>
