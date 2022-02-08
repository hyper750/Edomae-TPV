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
            <DeliveryCommandDialog ref="deliveryCommandDialog" />
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
                <h2>{{ $t("Today's commands") }}</h2>
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

    mounted() {
        this.loadCommands();
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
        };
    },

    methods: {
        openDeliveryCommandDialog() {
            this.deliveryCommandDialogOpen = true;
        },

        onCommandDialogClose() {
            this.$refs.deliveryCommandDialog.reset();
            this.loadCommands();
        },

        loadCommands() {
            // Load delivery commands from the last 24h
            const dayTime = 1000 * 60 * 60 * 24;
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - dayTime);
            const filters = {
                is_home_delivery: true,
                creation_date__gte: startDate.toISOString(),
                creation_date__lte: endDate.toISOString(),
            };
            CommandEndpoints.list(filters)
                .then(({ data }) => (this.commandList = data))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load commands")
                    )
                );
        },

        getPaidIcon(paid) {
            if (paid) {
                return "mdi-check";
            }

            return "mdi-close";
        },

        detailCommand(command) {
            // TODO:
            console.log(command);
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
    },
};
</script>
