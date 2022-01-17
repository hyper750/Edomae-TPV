<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <BreadCrumb />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <h2>
                    {{ $t("Table commands") }}
                </h2>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                {{ tableCommandList }}
                <v-data-table
                    :headers="tableCommandListHeaders"
                    :items="getTableItems"
                    class="elevation-1"
                >
                    <template slot="item.detail" slot-scope="props">
                        <v-btn icon @click="() => detailCommand(props.item)">
                            <v-icon dark> mdi-pencil </v-icon>
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

export default {
    components: {
        BreadCrumb,
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
                    text: "Delete",
                    value: "delete",
                },
            ],
            tableCommandList: [],

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
                        this.$i18n.t("Can't load commands")
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
        },

        detailCommand(command) {
            // TODO: Show detail of the command
            console.log(command);
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
    },
};
</script>
