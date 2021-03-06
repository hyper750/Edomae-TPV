<template>
    <v-card>
        <v-card-title>
            {{ $t("Command") }}
        </v-card-title>

        <v-dialog v-model="showCommandMealConfirmation" eager>
            <DeleteConfirmDialog @accept="() => deleteCommandMeal()" @deny="() => closeDeleteCommandMealConfirmation()" />
        </v-dialog>

        <v-card-text>
            <v-container fluid>
                <v-row>
                    <v-col md="12" cols="12">
                        <v-dialog v-model="deleteCommandConfirmation" eager>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    v-on="on"
                                    v-bind="attrs"
                                    color="error darken-1"
                                    text
                                    :disabled="haveCommand"
                                >
                                    <v-icon> mdi-delete </v-icon>
                                    {{ $t("Delete command") }}
                                </v-btn>
                            </template>
                            <DeleteConfirmDialog @accept="deleteCommand" @deny="closeDeleteCommandConfirmation" />
                        </v-dialog>
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="print"
                            :disabled="haveCommand"
                        >
                            <v-icon>mdi-printer</v-icon>
                            {{ $t("Print") }}
                        </v-btn>
                        <v-btn
                            color="success darken-1"
                            text
                            @click="pay"
                            :disabled="haveCommand"
                        >
                            <v-icon> mdi-cash-multiple </v-icon>
                            {{ $t("Pay") }}
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md="6" cols="12">
                        <v-row>
                            <v-col md="12" cols="12">
                                <v-data-table
                                    :headers="commandMealsHeaders"
                                    :items="getCommandMeals"
                                    class="elevation-1"
                                >
                                    <template
                                        slot="item.delete"
                                        slot-scope="props"
                                    >
                                        <v-btn
                                            class="mx-2"
                                            icon
                                            @click="
                                                () =>
                                                    selectCommandMealToDelete(
                                                        props.item
                                                    )
                                            "
                                        >
                                            <v-icon dark>mdi-delete</v-icon>
                                        </v-btn>
                                    </template>
                                </v-data-table>
                            </v-col>
                            <v-col md="12" cols="12">
                                <h4 class="text-right">
                                    {{ $t("Total price:") }}
                                    {{ getTotalPrice }} &euro;
                                </h4>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col md="6" cols="12">
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
            <PaymentProcess
                :command="command"
                @close="closePaymentProcess"
                @pay="commandPaid"
            />
        </v-dialog>
    </v-card>
</template>

<script>
import MealEndpoints from "../axios/api/meal";
import CommandEndpoints from "../axios/api/command";
import CommandMealEndpoints from "../axios/api/commandMeal";
import MenuMeals from "../components/MenuMeals";
import PaymentProcess from "../components/PaymentProcess";
import TicketCommandEndpoints from "../axios/api/ticketCommand";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";

export default {
    props: {
        table: Number,
    },

    components: {
        MenuMeals,
        PaymentProcess,
        DeleteConfirmDialog,
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
                {
                    text: "Delete",
                    value: "delete",
                },
            ],

            showPaymentProcess: false,
            deleteCommandConfirmation: false,
            showCommandMealConfirmation: false,
            selectedCommandMealToDelete: null,
        };
    },

    mounted() {
        this.loadMenu();
        this.loadCommand(this.table);
    },

    watch: {
        table: function (newValue) {
            this.loadCommand(newValue);
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

        getTotalPrice() {
            let total = 0;
            for (const commandMeal of this.commandMeals) {
                total += commandMeal.total_price;
            }
            const precision = 2;
            const multiplier = (10 ** precision);

            return Math.round(total * multiplier) / multiplier;
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

        async loadCommand(tableId) {
            if (tableId) {
                await this.loadTableCommand(tableId);
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
                is_home_delivery: false,
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
            this.loadCommand(this.table);
        },

        print() {
            if (!this.command) {
                this.$store.dispatch(
                    "setGlobalError",
                    this.$i18n.t("Empty command")
                );
                return;
            }

            TicketCommandEndpoints.get(this.command.id)
                .then(({ data }) => {
                    const ticketWindow = window.open();
                    ticketWindow.document.write(data);
                    ticketWindow.print();
                    ticketWindow.close();
                })
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't print that command")
                    )
                );
        },

        pay() {
            this.showPaymentProcess = true;
        },

        closePaymentProcess() {
            this.showPaymentProcess = false;
        },

        commandPaid() {
            this.closePaymentProcess();
            // Reload command
            this.loadCommand(this.table);
        },

        deleteCommand() {
            this.closeDeleteCommandConfirmation();
            if (!this.command) {
                this.$store.dispatch(
                    "setGlobalError",
                    this.$i18n.t("Can't delete an empty command")
                );
                return;
            }
            CommandEndpoints.delete(this.command.id)
                .then(() => this.loadCommand(this.table))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Error deleting the command")
                    )
                );
        },

        deleteCommandMeal() {
            CommandMealEndpoints.delete(this.selectedCommandMealToDelete.id)
                .then(() => {
                    this.closeDeleteCommandMealConfirmation();
                    this.loadCommand(this.table);
                })
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't delete the command meal")
                    )
                );
        },

        closeDeleteCommandConfirmation() {
            this.deleteCommandConfirmation = false;
        },

        selectCommandMealToDelete(commandMeal) {
            this.selectedCommandMealToDelete = commandMeal;
            this.showCommandMealConfirmation = true;
        },

        closeDeleteCommandMealConfirmation() {
            this.selectedCommandMealToDelete = null;
            this.showCommandMealConfirmation = false;
        },
    },
};
</script>
