<template>
    <v-card>
        <v-card-title>
            {{ $t("Command meal") }}
        </v-card-title>

        <v-card-text>
            <v-data-table
                :headers="commandMealsHeaders"
                :items="getCommandMealItems"
            >
                <template slot="item.delete" slot-scope="props">
                    <v-btn icon @click="() => deleteCommandMeal(props.item)">
                        <v-icon dark>mdi-delete</v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script>
import MealEndpoints from "../axios/api/meal";
import CommandMealEndpoints from "../axios/api/commandMeal";

export default {
    props: {
        command: Object,
    },

    mounted() {
        this.loadMeals();
    },

    watch: {
        command: function (newValue) {
            if (!newValue) {
                this.commandMeals = [];
                return;
            }

            this.loadCommandMeals(newValue);
        },
    },

    data() {
        return {
            meals: [],
            commandMeals: [],
            commandMealsHeaders: [
                {
                    text: this.$i18n.t("Article"),
                    value: "name",
                },
                {
                    text: this.$i18n.t("Quantity"),
                    value: "number",
                },
                {
                    text: this.$i18n.t("Price"),
                    value: "price_formatted",
                },
                {
                    text: this.$i18n.t("Extras"),
                    value: "extra",
                },
                {
                    text: this.$i18n.t("Discount"),
                    value: "discount_formatted",
                },
                {
                    text: this.$i18n.t("Total"),
                    value: "total_price_formatted",
                },
                {
                    text: "Delete",
                    value: "delete",
                },
            ],
        };
    },

    computed: {
        getCommandMealItems() {
            const data = [...this.commandMeals];

            data.map((commandMeal) => {
                const meal = this.meals.find(
                    ({ id }) => id === commandMeal.meal
                );
                // Get meal name from the menu
                commandMeal.name = meal.name;

                // Format discount
                commandMeal.discount_formatted = commandMeal.discount
                    ? `${commandMeal.discount}%`
                    : null;

                // Get price of the meal
                commandMeal.price_formatted = `${commandMeal.price}€`;

                // Add total price
                commandMeal.total_price_formatted = `${commandMeal.total_price}€`;
            });

            return data;
        },
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

        loadCommandMeals(command) {
            const filters = {
                command: command.id,
            };
            CommandMealEndpoints.list(filters)
                .then(({ data }) => (this.commandMeals = data))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load command meals")
                    )
                );
        },

        deleteCommandMeal(command) {
            CommandMealEndpoints.delete(command.id)
                .then(() => this.loadCommandMeals(this.command))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't delete command meal")
                    )
                );
        },
    },
};
</script>
