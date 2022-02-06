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
import DeliveryCommandDialog from "../components/DeliveryCommandDialog";
import CommandEndpoints from "../axios/api/command";

export default {
    components: {
        BreadCrumb,
        DeliveryCommandDialog,
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
            const now = new Date();
            // Load command for the current day
            const floor = 1000 * 60 * 60 * 24;
            const startDate = new Date(now.getTime() - (now.getTime() % floor));
            const endDate = new Date(startDate.getTime() + floor - 1);
            const filters = {
                is_home_delivery: true,
                creation_date__gte: startDate.toISOString(),
                creation_date__lte: endDate,
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
            // TODO:
            console.log(command);
        },

        deleteCommand(command) {
            // TODO:
            console.log(command);
        },
    },
};
</script>
