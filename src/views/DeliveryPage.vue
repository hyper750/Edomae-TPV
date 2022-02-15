<template>
    <v-container fluid>
        <v-row>
            <v-col md="12">
                <BreadCrumb />
            </v-col>
        </v-row>

        <v-dialog
            v-model="deliveryCommandDialogOpen"
            eager
            @click:outside="() => onCommandDialogClose()"
        >
            <DeliveryCommandDialog
                ref="deliveryCommandDialog"
                :editCommand="commandToEdit"
                @deleteCommand="() => onDeleteCommandFromDeliveryDialog()"
                @paymentDone="() => paymentDone()"
            />
        </v-dialog>

        <v-row>
            <v-col md="12">
                <v-btn
                    color="success"
                    @click="() => openDeliveryCommandDialog()"
                >
                    <v-icon dense class="mr-1"> mdi-plus </v-icon>
                    {{ $t("Add") }}
                </v-btn>
            </v-col>
        </v-row>

        <v-row>
            <v-col md="12">
                <h2>{{ $t("Delivery commands") }}</h2>
            </v-col>
        </v-row>

        <v-dialog v-model="showCommandDeleteDialog" eager>
            <DeleteConfirmDialog
                @accept="() => deleteCommand()"
                @deny="() => closeCommandDeleteDialog()"
            />
        </v-dialog>

        <v-row>
            <v-col md="12">
                <v-data-table
                    :headers="commandHeaders"
                    :items="commandList"
                    :server-items-length="deliveryCommandTotalItems"
                    :options.sync="deliveryCommandOptions"
                    :loading="deliveryCommandIsLoading"
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
import DeliveryCommandDialog from "../components/DeliveryCommandDialog";
import CommandEndpoints from "../axios/api/command";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import TicketCommandEndpoints from "../axios/api/ticketCommand";

export default {
    components: {
        BreadCrumb,
        DeliveryCommandDialog,
        DeleteConfirmDialog,
    },

    data() {
        return {
            deliveryCommandDialogOpen: false,
            commandList: [],
            commandHeaders: [
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
                    text: this.$i18n.t("Delivery details"),
                    value: "delivery_details",
                },
                {
                    text: this.$i18n.t("Paid"),
                    value: "paid",
                },
                {
                    text: this.$i18n.t("Detail"),
                    value: "detail",
                },
                {
                    text: this.$i18n.t("Print"),
                    value: "print",
                },
                {
                    text: this.$i18n.t("Delete"),
                    value: "delete",
                },
            ],

            commandToDelete: null,
            showCommandDeleteDialog: false,

            commandToEdit: null,

            deliveryCommandOptions: {},
            deliveryCommandIsLoading: false,
            deliveryCommandTotalItems: 0,
        };
    },

    watch: {
        deliveryCommandOptions: {
            handler() {
                this.loadCommands();
            },
            deep: true
        }
    },

    methods: {
        openDeliveryCommandDialog() {
            this.deliveryCommandDialogOpen = true;
        },

        onCommandDialogClose() {
            this.deliveryCommandDialogOpen = false;
            this.$refs.deliveryCommandDialog.reset();
            this.commandToEdit = null;
            this.loadCommands();
        },

        loadCommands() {
            const filters = {
                is_home_delivery: true,
                page_size: this.deliveryCommandOptions.itemsPerPage,
                page_num: this.deliveryCommandOptions.page,
            };
            this.deliveryCommandIsLoading = true;
            CommandEndpoints.list(filters)
                .then(({ data }) => {
                    this.commandList = data;
                    // TODO: Return the total number of items from the backend
                    if(data.length % this.deliveryCommandOptions.itemsPerPage !== 0) {
                        this.deliveryCommandTotalItems = (this.deliveryCommandOptions.itemsPerPage * (this.deliveryCommandOptions.page - 1)) + data.length;
                    }
                    else {
                        this.deliveryCommandTotalItems = (this.deliveryCommandOptions.itemsPerPage * this.deliveryCommandOptions.page) + this.deliveryCommandOptions.itemsPerPage;
                    }
                })
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load commands")
                    )
                )
                .finally(() => {
                    this.deliveryCommandIsLoading = false;
                });
        },

        getPaidIcon(paid) {
            if (paid) {
                return "mdi-check";
            }

            return "mdi-close";
        },

        detailCommand(command) {
            this.commandToEdit = command;
            this.openDeliveryCommandDialog();
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
                        this.$i18n.t("Can't print that commands")
                    )
                );
        },

        selectCommandToDelete(command) {
            this.commandToDelete = command.id;
            this.showCommandDeleteDialog = true;
        },

        closeCommandDeleteDialog() {
            this.commandToDelete = null;
            this.showCommandDeleteDialog = false;
        },

        deleteCommand() {
            CommandEndpoints.delete(this.commandToDelete)
                .then(() => this.loadCommands())
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't delete the command")
                    )
                )
                .finally(() => this.closeCommandDeleteDialog());
        },

        onDeleteCommandFromDeliveryDialog() {
            this.onCommandDialogClose();
        },

        paymentDone() {
            this.onCommandDialogClose();
        },
    },
};
</script>
