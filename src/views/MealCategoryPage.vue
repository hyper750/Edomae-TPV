<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <BreadCrumb />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-dialog
                    v-model="showCreateDialog"
                    @click:outside="resetMealCategoryCreateDialog"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="success" v-on="on" v-bind="attrs">
                            <v-icon dense class="mr-1">
                                mdi-plus
                            </v-icon>
                            {{ $t("Add") }}
                        </v-btn>
                    </template>
                    <MealCategoryDialog
                        ref="mealCategoryCreateDialog"
                        @close="closeCreateDialog"
                        @save="saveCreateDialog"
                    />
                </v-dialog>
            </v-col>
        </v-row>

        <v-dialog v-model="showUpdateDialog" eager>
            <MealCategoryDialog
                :mealCategory="updateMealCategory"
                @close="closeUpdateDialog"
                @save="saveUpdateDialog"
                @delete="deleteObjectDialog"
            />
        </v-dialog>

        <draggable
            v-model="mealCategories"
            group="mealCategories"
            @start="drag = true"
            @end="drag = false"
            class="row mt-2"
            @update="(event) => onMealCategoriesOrderChange(event)"
        >
            <v-col
                md="4"
                v-for="mealCategory in mealCategories"
                :key="mealCategory.id"
            >
                <span @click.stop="() => openUpdateDialog(mealCategory)">
                    <MealCategoryObject :mealCategory="mealCategory" />
                </span>
            </v-col>
        </draggable>
    </v-container>
</template>

<script>
import BreadCrumb from "../components/BreadCrumb";
import MealCategoryEndpoints from "../axios/api/mealCategory";
import MealCategoryObject from "../components/MealCategoryObject";
import MealCategoryDialog from "../components/MealCategoryDialog";
import draggable from "vuedraggable";

export default {
    components: {
        draggable,
        BreadCrumb,
        MealCategoryObject,
        MealCategoryDialog,
    },

    data() {
        return {
            mealCategories: [],
            showUpdateDialog: false,
            showCreateDialog: false,
            updateMealCategory: null,
        };
    },

    mounted() {
        this.loadMealCategory();
    },

    methods: {
        loadMealCategory() {
            MealCategoryEndpoints.list()
                .then(({ data }) => (this.mealCategories = data))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Error listing meal categories")
                    )
                );
        },

        saveCreateDialog() {
            this.closeCreateDialog();
            this.loadMealCategory();
        },

        saveUpdateDialog() {
            this.closeUpdateDialog();
            this.loadMealCategory();
        },

        closeCreateDialog() {
            this.showCreateDialog = false;
        },

        closeUpdateDialog() {
            this.showUpdateDialog = false;
        },

        openUpdateDialog(mealCategory) {
            this.updateMealCategory = mealCategory;
            this.showUpdateDialog = true;
        },

        deleteObjectDialog() {
            this.closeUpdateDialog();
            this.loadMealCategory();
        },

        resetMealCategoryCreateDialog() {
            this.$refs.mealCategoryCreateDialog.close();
        },

        onMealCategoriesOrderChange(event) {
            const newIndex = event.newIndex;
            const oldIndex = event.oldIndex;

            // Update current element position
            // And on the backend shift the other elements between the position updated
            let newOrder;
            if (oldIndex < newIndex) {
                newOrder = (newIndex - 1 >= 0)? this.mealCategories[newIndex - 1].order : 1;
            } else {
                newOrder = (newIndex + 1 < this.mealCategories.length)? this.mealCategories[newIndex + 1].order : this.mealCategories.length;
            }
            MealCategoryEndpoints.put(this.mealCategories[newIndex].id, {
                order: newOrder,
            })
                .then(() => this.loadMealCategory())
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Error updating meal categories")
                    )
                );
        },
    },
};
</script>
