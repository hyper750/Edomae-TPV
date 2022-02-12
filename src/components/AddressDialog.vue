<template>
    <v-card>
        <v-card-title>{{ $t("Address") }}</v-card-title>
        <v-card-text>
            <v-container fluid>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="address"
                            :label="$t('Address')"
                            :rules="addressRules"
                        />
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            v-model="addressDetails"
                            :label="$t('Address details')"
                            :rules="addressRules"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>

        <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="() => close()">
                {{ $t("Close") }}
            </v-btn>
            <v-btn color="blue darken-1" text @click="() => save()">
                {{ $t("Save") }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import CommandEndpoints from "../axios/api/command";

export default {
    props: {
        command: Object,
    },

    data() {
        return {
            address: null,
            addressRules: [
                (f) =>
                    !f ||
                    f.length <= 256 ||
                    this.$i18n.t("Max length is 256 caracters"),
            ],
            addressDetails: null,
        };
    },

    methods: {
        reset() {
            this.address = null;
            this.addressDetails = null;
        },

        close() {
            this.reset();
            this.$emit("close");
        },

        save() {
            const addressUpdate = {
                delivery_address: this.address,
                delivery_details: this.addressDetails,
            };
            CommandEndpoints.put(this.command.id, addressUpdate)
                .then(() => this.$emit("save"))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't save address to that command")
                    )
                )
                .finally(() => this.reset());
        },
    },
};
</script>
