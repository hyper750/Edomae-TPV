<template>
    <v-card>
        <v-card-title>
            {{ $t("Command") }}
        </v-card-title>

        <v-dialog v-model="commandMealDeleteDialogOpen" eager>
            <DeleteConfirmDialog
                @accept="() => deleteCommandMeal()"
                @deny="() => closeCommandMealDeleteDialog()"
            />
        </v-dialog>

        <v-dialog v-model="commandDeleteDialogOpen" eager>
            <DeleteConfirmDialog
                @accept="() => deleteCommand()"
                @deny="() => closeCommandDeleteDialog()"
            />
        </v-dialog>

        <v-card-text>
            <v-container fluid>
                <v-row>
                    <v-col md="12" cols="12">
                        <v-btn
                            color="error darken-1"
                            text
                            :disabled="withoutCommand"
                            @click="() => openCommandDeleteDialog()"
                        >
                            <v-icon> mdi-delete </v-icon>
                            {{ $t("Delete command") }}
                        </v-btn>
                        <v-btn
                            color="blue darken-1"
                            text
                            :disabled="withoutCommand"
                            @click="() => printCommand()"
                        >
                            <v-icon>mdi-printer</v-icon>
                            {{ $t("Print") }}
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
                            :command="getCommand()"
                            ref="menuMeals"
                            @createCommand="() => createCommand()"
                            @mealAdded="() => mealAdded()"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
/**
 * TODO:
 * - Be able to pay
 * - Be able to add address to the command
 */
import MenuMeals from "../components/MenuMeals";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import MealEndpoints from "../axios/api/meal";
import CommandEndpoints from "../axios/api/command";
import CommandMealEndpoints from "../axios/api/commandMeal";
import TicketCommandEndpoints from "../axios/api/ticketCommand";

export default {
    props: {
        editCommand: Object,
    },

    components: {
        MenuMeals,
        DeleteConfirmDialog,
    },

    data() {
        return {
            mealsMenu: [],

            command: null,
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

            commandMealToDelete: null,
            commandMealDeleteDialogOpen: false,

            commandDeleteDialogOpen: false,
        };
    },

    mounted() {
        this.loadMenu();
        this.loadCommand();
    },

    watch: {
        editCommand: function () {
            this.command = null;
            this.loadCommand();
        },
    },

    methods: {
        getCommand() {
            return this.editCommand || this.command;
        },

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

        async createCommand() {
            const commandData = {
                is_home_delivery: true,
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

        async loadCommand() {
            if (this.getCommand()) {
                await this.loadCommandMeal();
            } else {
                this.commandMeals = [];
            }
        },

        async loadCommandMeal() {
            const filters = {
                command: this.getCommand().id,
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

        mealAdded() {
            this.loadCommand();
        },

        deleteCommandMeal() {
            CommandMealEndpoints.delete(this.commandMealToDelete.id)
                .then(() => this.loadCommand())
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't delete the command meal")
                    )
                )
                .finally(() => this.closeCommandMealDeleteDialog());
        },

        selectCommandMealToDelete(commandMeal) {
            this.commandMealToDelete = commandMeal;
            this.openCommandMealDeleteDialog();
        },

        openCommandMealDeleteDialog() {
            this.commandMealDeleteDialogOpen = true;
        },

        closeCommandMealDeleteDialog() {
            this.commandMealToDelete = null;
            this.commandMealDeleteDialogOpen = false;
        },

        openCommandDeleteDialog() {
            this.commandDeleteDialogOpen = true;
        },

        closeCommandDeleteDialog() {
            this.commandDeleteDialogOpen = false;
        },

        deleteCommand() {
            CommandEndpoints.delete(this.getCommand().id)
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't delete command")
                    )
                )
                .finally(() => {
                    this.command = null;
                    this.commandMeals = [];
                    this.closeCommandDeleteDialog();
                });
        },

        reset() {
            this.$refs.menuMeals.reset();
            this.command = null;
            this.commandMeals = [];
        },

        printCommand() {
            TicketCommandEndpoints.get(this.getCommand().id)
                .then(({ data }) => {
                    const ticketWindow = window.open();
                    ticketWindow.document.write(data);
                    ticketWindow.print();
                    ticketWindow.close();
                })
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't print that ticket")
                    )
                );
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

        getTotalPrice() {
            let total = 0;
            for (const commandMeal of this.commandMeals) {
                total += commandMeal.total_price;
            }
            const precision = 2;
            const multiplier = 10 ** precision;

            return Math.round(total * multiplier) / multiplier;
        },

        withoutCommand() {
            return !this.getCommand();
        },
    },
};
</script>
