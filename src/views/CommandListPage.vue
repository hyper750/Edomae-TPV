<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <BreadCrumb />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-btn color="blue darken-1" text @click="generateSerieTicket">
                    {{ $t("Generate daily tickets") }}
                </v-btn>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <h2>
                    {{ $t("Table commands") }}
                </h2>
            </v-col>
        </v-row>

        <v-dialog v-model="showCommandMealListDialog" eager>
            <CommandMealListDialog :command="selectedCommand" />
        </v-dialog>

        <v-row>
            <v-col cols="12">
                <v-data-table
                    :headers="tableCommandListHeaders"
                    :items="getTableItems"
                    class="elevation-1"
                >
                    <template slot="item.paid" slot-scope="props">
                        <v-icon>
                            {{ getPaidIcon(props.item.paid) }}
                        </v-icon>
                    </template>
                    <template slot="item.detail" slot-scope="props">
                        <v-btn icon @click="() => detailCommand(props.item)">
                            <v-icon dark> mdi-pencil </v-icon>
                        </v-btn>
                    </template>
                    <template slot="item.print" slot-scope="props">
                        <v-btn icon @click="() => printCommand(props.item)">
                            <v-icon dark> mdi-printer </v-icon>
                        </v-btn>
                    </template>
                    <template slot="item.delete" slot-scope="props">
                        <v-btn icon @click="() => deleteCommand(props.item)">
                            <v-icon dark> mdi-delete </v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

        <v-row class="pt-6">
            <v-col cols="12">
                <h2>
                    {{ $t("Delivery commands") }}
                </h2>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-data-table
                    :headers="deliveryCommandListHeaders"
                    :items="getDeliveryItems"
                    class="elevation-1"
                >
                    <template slot="item.paid" slot-scope="props">
                        <v-icon>
                            {{ getPaidIcon(props.item.paid) }}
                        </v-icon>
                    </template>
                    <template slot="item.detail" slot-scope="props">
                        <v-btn icon @click="() => detailCommand(props.item)">
                            <v-icon dark> mdi-pencil </v-icon>
                        </v-btn>
                    </template>
                    <template slot="item.print" slot-scope="props">
                        <v-btn icon @click="() => printCommand(props.item)">
                            <v-icon dark> mdi-printer </v-icon>
                        </v-btn>
                    </template>
                    <template slot="item.delete" slot-scope="props">
                        <v-btn icon @click="() => deleteCommand(props.item)">
                            <v-icon dark> mdi-delete </v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import BreadCrumb from "../components/BreadCrumb";
import CommandEndpoints from "../axios/api/command";
import TicketCommandEndpoints from "../axios/api/ticketCommand";
import CommandMealListDialog from "../components/CommandMealListDialog";

export default {
    components: {
        BreadCrumb,
        CommandMealListDialog,
    },

    mounted() {
        this.loadCommands();
    },

    data() {
        // const endDate = new Date();
        // const shiftTime = 7 * 24 * 60* 60 * 1000;
        // const startDate = new Date(endDate.getTime() - shiftTime);
        return {
            tableCommandListHeaders: [
                {
                    text: this.$i18n.t("Id"),
                    value: "id",
                },
                {
                    text: this.$i18n.t("Date"),
                    value: "creation_date",
                },
                {
                    text: this.$i18n.t("Table"),
                    value: "table",
                },
                {
                    text: this.$i18n.t("Paid"),
                    value: "paid",
                },
                {
                    text: "Detail",
                    value: "detail",
                },
                {
                    text: "Print",
                    value: "print",
                },
                {
                    text: "Delete",
                    value: "delete",
                },
            ],
            tableCommandList: [],

            deliveryCommandListHeaders: [
                {
                    text: this.$i18n.t("Id"),
                    value: "id",
                },
                {
                    text: this.$i18n.t("Date"),
                    value: "creation_date",
                },
                {
                    text: this.$i18n.t("Delivery address"),
                    value: "delivery_address",
                },
                {
                    text: this.$i18n.t("Paid"),
                    value: "paid",
                },
                {
                    text: "Detail",
                    value: "detail",
                },
                {
                    text: "Print",
                    value: "print",
                },
                {
                    text: "Delete",
                    value: "delete",
                },
            ],
            deliveryCommandList: [],

            selectedCommand: null,
            showCommandMealListDialog: false,

            // creation_date__gte: startDate.toISOString(),
            // creation_date__lte: endDate.toISOString(),

            page_size: 50,
            page_num: 1,
        };
    },

    computed: {
        getTableItems() {
            return this.tableCommandList;
        },

        getDeliveryItems() {
            return this.deliveryCommandList;
        },
    },

    methods: {
        loadTableCommands(filters) {
            const tableFilters = {
                ...filters,
                is_home_delivery: false,
            };
            CommandEndpoints.list(tableFilters)
                .then(({ data }) => (this.tableCommandList = data))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load table commands")
                    )
                );
        },

        loadDeliveryCommands(filters) {
            const deliveryFilters = {
                ...filters,
                is_home_delivery: true,
            };
            CommandEndpoints.list(deliveryFilters)
                .then(({ data }) => (this.deliveryCommandList = data))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load delivery commands")
                    )
                );
        },

        loadCommands() {
            const filters = {
                page_size: this.page_size,
                page_num: this.page_num,
                // creation_date__gte: this.creation_date__gte,
                // creation_date__lte: this.creation_date__lte
            };
            this.loadTableCommands(filters);
            this.loadDeliveryCommands(filters);
        },

        detailCommand(command) {
            this.selectedCommand = command;
            this.showCommandMealListDialog = true;
        },

        deleteCommand(command) {
            CommandEndpoints.delete(command.id)
                .then(() => this.loadCommands())
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't delete the command")
                    )
                );
        },

        printCommand(command) {
            TicketCommandEndpoints.get(command.id)
                .then(({ data }) => {
                    const ticketWindow = window.open();
                    ticketWindow.document.write(data);
                    ticketWindow.print();
                    ticketWindow.close();
                })
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't print the command")
                    )
                );
        },

        getPaidIcon(paid) {
            if (paid) {
                return "mdi-check";
            }

            return "mdi-close";
        },

        generateSerieTicket() {
            TicketCommandEndpoints.list()
                .then(({ data }) => {
                    for (const day of data) {
                        const ticketWindow = window.open();
                        ticketWindow.document.write(day.html);
                        ticketWindow.print();
                        ticketWindow.close();
                    }
                })
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't generate daily tickets")
                    )
                );
        },
    },
};
</script>
