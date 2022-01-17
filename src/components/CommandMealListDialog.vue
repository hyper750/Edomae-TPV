<template>
    <v-card>
        <v-card-title>
            {{ $t("Command meal") }}
        </v-card-title>

        <v-card-text>
            {{ command }}
        </v-card-text>
    </v-card>
</template>

<script>
import MealEndpoints from "../axios/api/meal";

export default {
    props: {
        command: Object,
    },

    mounted() {
        this.loadMeals();
    },

    data() {
        return {
            meals: [],
        };
    },

    methods: {
        loadMeals() {
            const filters = {
                enabled: true,
            };
            MealEndpoints.list(filters)
                .then(({ data }) => (this.meals = data))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load meals")
                    )
                );
        },
    },
};
</script>
