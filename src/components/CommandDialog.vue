<template>
    <v-card>
        <v-card-title>
            {{ $t("Command") }}
        </v-card-title>

        <v-card-text>
            <v-container fluid>
                <v-row>
                    <v-col md="12">
                        <v-btn color="blue darken-1" text @click="print" :disabled="haveCommand">
                            <v-icon>mdi-printer</v-icon>
                            {{ $t("Print") }}
                        </v-btn>
                        <v-btn color="success darken-1" text @click="pay" :disabled="haveCommand">
                            <v-icon> mdi-cash-multiple </v-icon>
                            {{ $t("Pay") }}
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md="6">
                        <v-data-table
                            :headers="commandMealsHeaders"
                            :items="getCommandMeals"
                            class="elevation-1"
                        />
                    </v-col>
                    <v-col md="6">
                        <MenuMeals
                            :meals="mealsMenu"
                            :command="command"
                            ref="menuMeals"
                            @createCommand="createCommand"
                            @mealAdded="mealAdded"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>

        <v-dialog v-model="showPaymentProcess" eager>
            <PaymentProcess :command="command" @close="closePaymentProcess" @pay="commandPaid" />
        </v-dialog>
    </v-card>
</template>

<script>
import MealEndpoints from "../axios/api/meal";
import CommandEndpoints from "../axios/api/command";
import CommandMealEndpoints from "../axios/api/commandMeal";
import MenuMeals from "../components/MenuMeals";
import PaymentProcess from "../components/PaymentProcess";

export default {
    props: {
        table: Number,
        deliveryCommand: Boolean,
    },

    components: {
        MenuMeals,
        PaymentProcess,
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
            ],

            showPaymentProcess: false,
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
            this.loadCommand(null, newValue);
        },
    },

    computed: {
        getCommandMeals() {
            const commandMeals = [...this.commandMeals];

            commandMeals.map((commandMeal) => {
                const meal = this.mealsMenu.find(
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
            return commandMeals;
        },

        haveCommand() {
            return this.command === null;
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

        async loadCommandMeal(commandId) {
            const filters = {
                command: commandId,
            };

            CommandMealEndpoints.list(filters)
                .then(({ data }) => {
                    this.commandMeals = data;
                })
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load command meal")
                    )
                );
        },

        async loadCommand(tableId, deliveryCommand) {
            if (tableId && !deliveryCommand) {
                await this.loadTableCommand(tableId);
            } else if (!tableId && deliveryCommand) {
                // TODO: Load delivery command
            }

            // Reset command meals if there's no command available
            if (!this.command) {
                this.commandMeals = [];
            } else {
                this.loadCommandMeal(this.command.id);
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
                    if (data.length === 0) {
                        this.command = null;
                    } else {
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

        reset() {
            this.$refs.menuMeals.reset();
        },

        async createCommand() {
            const commandData = {
                is_home_delivery: this.deliveryCommand,
                table: this.table,
            };
            await CommandEndpoints.post(commandData)
                .then(({ data }) => (this.command = data))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't create a command")
                    )
                );
        },

        mealAdded() {
            this.loadCommand(this.table, this.deliveryCommand);
        },

        print() {},

        pay() {
            this.showPaymentProcess = true;
        },

        closePaymentProcess() {
            this.showPaymentProcess = false;
        },

        commandPaid() {
            this.closePaymentProcess();
            // Reload command
            this.loadCommand(this.table, this.deliveryCommand);
        },
    },
};
</script>
