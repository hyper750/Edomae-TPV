<template>
    <v-card>
        <v-card-title>
            {{ $t("Command") }}
        </v-card-title>

        <v-card-text>
            <v-container fluid>
                <v-row>
                    <v-col md="6">
                        <v-data-table
                            :headers="commandMealsHeaders"
                            :items="commandMeals"
                            class="elevation-1"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>

        <v-card-actions> </v-card-actions>
    </v-card>
</template>

<script>
import MealEndpoints from "../axios/api/meal";
import CommandEndpoints from "../axios/api/command";
// import CommandMealEndpoints from "../axios/api/commandMeal";

export default {
    props: {
        table: Number,
        deliveryCommand: Boolean,
    },

    data() {
        return {
            command: null,
            commandMeals: [],

            mealsMenu: [],
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
                    text: this.$i18n.t("Extras"),
                    value: "extra",
                },
                {
                    discount: this.$i18n.t("Discount"),
                    value: "discount",
                },
            ],
        };
    },

    mounted() {
        this.loadMenu();
        this.loadCommand(this.table, this.deliveryCommand);
    },

    watch: {
        table: function (newValue) {
            this.loadCommand(newValue, this.deliveryCommand);
        },
        deliveryCommand: function (newValue) {
            this.loadCommand(this.tableId, newValue);
        },
    },

    methods: {
        async loadMenu() {
            await MealEndpoints.list({ enabled: true })
                .then(({ data }) => (this.mealsMenu = data))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load the menu")
                    )
                );
        },

        async loadCommandMeal() {},

        async loadCommand(tableId, deliveryCommand) {
            if (tableId && !deliveryCommand) {
                this.loadTableCommand(tableId);
            } else if (!tableId && deliveryCommand) {
                // TODO: Load delivery command
            }
        },

        async loadTableCommand(tableId) {
            const filters = {
                table: tableId,
                is_home_delivery: false,
                // Already unpaid, running on that table
                paid: false,
            };
            
            await CommandEndpoints.list(filters)
                .then(({ data }) => {
                    if(data.length === 0) {
                        this.command = null;
                    }
                    else {
                        this.command = data[0];
                    }
                })
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18.t("Can't load table command")
                    )
                );
        },
    },
};
</script>
