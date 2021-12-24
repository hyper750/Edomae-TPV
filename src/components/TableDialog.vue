<template>
    <v-card>
        <v-card-title>{{ $t("Table") }}</v-card-title>

        <v-card-text>
            <v-container fluid>
                <v-row>
                    <v-col md="4">
                        <v-checkbox v-model="enabled" :label="$t('Enabled')" />
                    </v-col>
                    <v-col md="4">
                        <v-text-field
                            type="number"
                            v-model="number"
                            :label="$t('Table number')"
                            :rules="numberRules"
                        />
                    </v-col>
                    <v-col md="4">
                        <v-text-field
                            type="number"
                            v-model="numberOfPersons"
                            :label="$t('Number of commensals')"
                            :rules="numberRules"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>

        <v-card-actions>
            <v-dialog v-model="deleteDialog">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="error darken-1"
                        text
                        v-show="table"
                        v-on="on"
                        v-bind="attrs"
                    >
                        {{ $t("Delete") }}
                    </v-btn>
                </template>
                <DeleteConfirmDialog
                    @accept="acceptConfirmDialog"
                    @deny="closeConfirmDialog"
                />
            </v-dialog>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="close()">
                {{ $t("Close") }}
            </v-btn>
            <v-btn color="blue darken-1" text @click="save()">
                {{ $t("Save") }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import TableEndpoints from "../axios/api/table";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";

export default {
    props: {
        local: Number,
        table: Object,
        xCoordinates: Number,
        yCoordinates: Number,
    },

    components: {
        DeleteConfirmDialog,
    },

    data() {
        return {
            enabled: true,

            number: 1,
            numberRules: [
                (f) => f.length !== 0 || this.$t("Put a table number"),
                (f) =>
                    parseInt(f) > 0 ||
                    this.$t("The table number must be positive"),
            ],

            numberOfPersons: 1,

            deleteDialog: false,
        };
    },

    watch: {
        table: function (newValue) {
            if (!newValue) {
                this.resetForm();
            } else {
                this.enabled = newValue.enabled;
                this.number = newValue.number;
                this.numberOfPersons = newValue.number_of_persons;
            }
        },
    },

    methods: {
        resetForm() {
            this.enabled = true;
            this.number = 1;
            this.numberOfPersons = 1;
        },
        close() {
            console.log('close');
            this.resetForm();
            this.$emit("close");
        },

        async save() {
            const tableUpdate = {
                enabled: this.enabled,
                local: this.local,
                number: this.number,
                number_of_persons: this.numberOfPersons,
            };

            // Update
            if (this.table) {
                // Update coordinates using drag and drop
                await TableEndpoints.put(this.table.id, tableUpdate).catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't update the table")
                    )
                );
            }
            // Create
            else {
                // Only set coordinates when creating the table
                tableUpdate.x_coordinates = this.xCoordinates;
                tableUpdate.y_coordinates = this.yCoordinates;
                await TableEndpoints.post(tableUpdate).catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't insert the table")
                    )
                );
            }

            this.resetForm();
            this.$emit("save");
        },

        async deleteObject() {
            await TableEndpoints.delete(this.table.id).catch(() =>
                this.$store.dispatch(
                    "setGlobalError",
                    this.$i18n.t("Can't delete the table")
                )
            );
            this.resetForm();
            this.$emit("delete");
        },

        closeConfirmDialog() {
            this.deleteDialog = false;
        },

        async acceptConfirmDialog() {
            this.closeConfirmDialog();
            await this.deleteObject();
        },
    },
};
</script>
