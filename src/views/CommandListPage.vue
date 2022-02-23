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
                <v-menu offset-y :close-on-content-click="false">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="blue darken-1"
                            text
                            v-bind="attrs"
                            v-on="on"
                        >
                            {{ $t("Filter date") }}
                        </v-btn>
                    </template>
                    <v-container fluid class="white">
                        <v-row>
                            <v-col cols="12" class="pa-0">
                                <v-date-picker
                                    v-model="dateFilter"
                                    range
                                    :max="new Date().toISOString()"
                                />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" class="text-right">
                                <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="() => reloadCommands()"
                                >
                                    {{ $t("Save") }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-menu>
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

        <v-dialog v-model="showCommandDeleteConfirmation" eager>
            <DeleteConfirmDialog
                @accept="() => deleteCommand()"
                @deny="() => closeCommandDeleteConfirmation()"
            />
        </v-dialog>

        <v-row>
            <v-col cols="12">
                <v-data-table
                    :headers="tableCommandListHeaders"
                    :items="getTableItems"
                    :loading="tableIsLoading"
                    :server-items-length="tableTotalCommands"
                    :options.sync="tableOptions"
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
                        <v-btn
                            icon
                            @click="() => selectCommandToDelete(props.item)"
                        >
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
                    :server-items-length="deliveryTotalCommands"
                    :options.sync="deliveryOptions"
                    :loading="deliveryIsLoading"
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
                        <v-btn
                            icon
                            @click="() => selectCommandToDelete(props.item)"
                        >
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
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import TableEndpoints from "../axios/api/table";

export default {
    components: {
        BreadCrumb,
        CommandMealListDialog,
        DeleteConfirmDialog,
    },

    watch: {
        tableOptions: {
            handler() {
                this.loadTableCommands();
            },
            deep: true,
        },
        deliveryOptions: {
            handler() {
                this.loadDeliveryCommands();
            },
            deep: true,
        },
    },

    mounted() {
        this.loadTableList();
    },

    data() {
        return {
            tableList: [],

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
                    value: "table_num",
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

            showCommandDeleteConfirmation: false,
            selectedCommandToDelete: null,

            tableOptions: {},
            tableIsLoading: false,
            tableTotalCommands: 0,

            deliveryOptions: {},
            deliveryIsLoading: false,
            deliveryTotalCommands: 0,

            // By default select the last 60 days
            dateFilter: [
                new Date(
                    new Date().getTime() - 1000 * 60 * 60 * 24 * 60
                ).toISOString(),
                new Date().toISOString(),
            ],
        };
    },

    computed: {
        getTableItems() {
            return this.tableCommandList.map((tableCommand) => {
                const tableContent = this.tableList.find((t) => t.id === tableCommand.table);

                if(tableContent) {
                    tableCommand.table_num = tableContent.number;
                }

                return tableCommand;
            });
        },

        getDeliveryItems() {
            return this.deliveryCommandList;
        },

        getStartDate() {
            const startDateTimestamp = Math.min(
                ...this.dateFilter.map((d) => new Date(d))
            );
            return new Date(startDateTimestamp);
        },

        getEndDate() {
            const endDateTimestamp = Math.max(
                ...this.dateFilter.map((d) => new Date(d))
            );
            return new Date(endDateTimestamp);
        },
    },

    methods: {
        loadTableList() {
            TableEndpoints.list()
                .then(({ data }) => {
                    this.tableList = data;
                })
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load tables")
                    )
                );
        },

        loadTableCommands() {
            const tableFilters = {
                page_size: this.tableOptions.itemsPerPage,
                page_num: this.tableOptions.page,
                is_home_delivery: false,
                creation_date__gte: this.getStartDate.toISOString(),
                creation_date__lte: this.getEndDate.toISOString(),
            };
            this.tableIsLoading = true;
            CommandEndpoints.list(tableFilters)
                .then(({ data }) => {
                    this.tableCommandList = data;
                    // TODO: Return the total number of items from the backend
                    if (data.length % this.tableOptions.itemsPerPage !== 0) {
                        this.tableTotalCommands =
                            this.tableOptions.itemsPerPage *
                                (this.tableOptions.page - 1) +
                            data.length;
                    } else {
                        this.tableTotalCommands =
                            this.tableOptions.itemsPerPage *
                                this.tableOptions.page +
                            this.tableOptions.itemsPerPage;
                    }
                })
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load table commands")
                    )
                )
                .finally(() => {
                    this.tableIsLoading = false;
                });
        },

        loadDeliveryCommands() {
            const deliveryFilters = {
                page_size: this.deliveryOptions.itemsPerPage,
                page_num: this.deliveryOptions.page,
                is_home_delivery: true,
                creation_date__gte: this.getStartDate.toISOString(),
                creation_date__lte: this.getEndDate.toISOString(),
            };
            this.deliveryIsLoading = true;
            CommandEndpoints.list(deliveryFilters)
                .then(({ data }) => {
                    this.deliveryCommandList = data;
                    // TODO: Return the total number of items from the backend
                    if (data.length % this.deliveryOptions.itemsPerPage !== 0) {
                        this.deliveryTotalCommands =
                            this.deliveryOptions.itemsPerPage *
                                (this.deliveryOptions.page - 1) +
                            data.length;
                    } else {
                        this.deliveryTotalCommands =
                            this.deliveryOptions.itemsPerPage *
                                this.deliveryOptions.page +
                            this.deliveryOptions.itemsPerPage;
                    }
                })
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load delivery commands")
                    )
                )
                .finally(() => {
                    this.deliveryIsLoading = false;
                });
        },

        detailCommand(command) {
            this.selectedCommand = command;
            this.showCommandMealListDialog = true;
        },

        deleteCommand() {
            CommandEndpoints.delete(this.selectedCommandToDelete.id)
                .then(() => {
                    this.closeCommandDeleteConfirmation();
                    this.loadTableCommands();
                    this.loadDeliveryCommands();
                })
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
            const filters = {
                creation_date__gte: this.getStartDate.toISOString(),
                creation_date__lte: this.getEndDate.toISOString(),
            };

            TicketCommandEndpoints.list(filters)
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

        selectCommandToDelete(command) {
            this.selectedCommandToDelete = command;
            this.showCommandDeleteConfirmation = true;
        },

        closeCommandDeleteConfirmation() {
            this.selectedCommandToDelete = null;
            this.showCommandDeleteConfirmation = false;
        },

        reloadCommands() {
            this.loadTableCommands();
            this.loadDeliveryCommands();
        },
    },
};
</script>
