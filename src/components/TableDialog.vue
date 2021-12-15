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

export default {
    props: {
        local: Number,
        table: Object,
    },

    data() {
        return {
            enabled: true,

            number: 1,
            numberRules: [
                (f) => f.length !== 0 || this.$t("Put a local number"),
                (f) =>
                    parseInt(f) > 0 ||
                    this.$t("The local number must be positive"),
            ],

            numberOfPersons: 1,
        };
    },

    watch: {
        table: function(newValue) {
            if(!newValue) {
                this.resetForm();
            }
            else {
                this.enabled = newValue.enabled;
                this.number = newValue.number;
                this.numberOfPersons = newValue.number_of_persons;
            }
        }
    },

    methods: {
        resetForm() {
            this.enabled = true;
            this.number = 1;
            this.numberOfPersons = 1;
        },
        close() {
            this.resetForm();
            this.$emit("close");
        },

        async save() {
            const tableUpdate = {
                enabled: this.enabled,
                local: this.local,
                number: this.number,
                number_of_persons: this.numberOfPersons,
                x_coordinates: 0.0,
                y_coordinates: 0.0,
            };

            // Update
            if (this.table) {
                await TableEndpoints.put(this.table.id, tableUpdate).catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't update the table")
                    )
                );
            }
            // Create
            else {
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
    },
};
</script>
