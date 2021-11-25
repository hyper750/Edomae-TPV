<template>
    <v-hover v-slot="{ hover }">
        <v-card
            class="cursor-pointer mb-4 bg-white"
            :class="{ 'elevation-12': hover, 'elevation-6': !hover }"
        >
            <v-img
                :src="meal.imatge"
                height="250"
                :class="{ disabledOpacity: !meal.enabled }"
            />

            <v-card-title>
                <v-row no-gutters>
                    <v-col cols="10">
                        {{ meal.name }}
                    </v-col>
                    <v-col cols="2 text-right"> {{ meal.price }}&euro; </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <div>
                    {{ meal.description }}
                </div>
            </v-card-text>
        </v-card>
    </v-hover>
</template>

<script>
import MealEndpoints from "../axios/api/meal";

export default {
    props: {
        meal: Object,
    },

    methods: {
        async deleteObject() {
            await MealEndpoints.delete(this.meal.id).catch(() =>
                this.$store.dispatch(
                    "setGlobalError",
                    this.$i18n.t("Error deleting meal")
                )
            );
        },
    },
};
</script>
