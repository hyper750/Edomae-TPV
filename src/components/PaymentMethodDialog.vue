<template>
    <v-card>
        <v-card-title>{{ $t("Payment method") }}</v-card-title>
        <v-card-text>
            <v-container fluid>
                <v-row>
                    <v-col md="12">
                        <v-checkbox v-model="enabled" :label="$t('Enabled')" />
                    </v-col>
                    <v-col md="6">
                        <v-text-field
                            v-model="name"
                            :label="$t('Name')"
                            counter="124"
                            :rules="nameRules"
                        />
                    </v-col>
                    <v-col md="6">
                        <v-file-input
                            v-model="image"
                            :label="$t('Image')"
                            accept="image/*"
                            :imageRules="imageRules"
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
                        v-show="paymentMethod"
                        v-on="on"
                        v-bind="attrs"
                    >
                        {{ $t("Delete") }}
                    </v-btn>
                </template>
                <DeleteConfirmDialog
                    @accept="deleteObject"
                    @deny="closeDeleteDialog"
                />
            </v-dialog>
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
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import PaymentMethodEndpoints from "../axios/api/paymentMethod";

export default {
    props: {
        paymentMethod: Object,
    },

    components: {
        DeleteConfirmDialog,
    },

    data() {
        return {
            enabled: true,

            name: "",
            nameRules: [
                (f) => f.length <= 124 || this.$t("Max 124 caracters"),
                (f) =>
                    f.length > 0 || this.$t("At least a character is required"),
            ],

            image: null,
            imageRules: [
                (f) =>
                    (f !== null && f.length > 0) ||
                    this.$i18n.t("An imatge is required"),
            ],

            deleteDialog: false,
        };
    },

    watch: {
        paymentMethod: function (newValue) {
            this.enabled = newValue.enabled;
            this.name = newValue.name;
            // this.image = newValue.image;
        },
    },

    methods: {
        resetForms() {
            // Reset form attributes only if is create mode
            if(this.paymentMethod) {
                return;
            }

            this.enabled = true;
            this.name = "";
            this.image = null;
        },

        closeDeleteDialog() {
            this.deleteDialog = false;
        },

        async deleteObject() {
            this.closeDeleteDialog();
            await PaymentMethodEndpoints.delete(this.paymentMethod.id).catch(
                () =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$t("Can't delete payment method")
                    )
            );
            this.resetForms();
            this.$emit("delete");
        },

        close() {
            this.resetForms();
            this.$emit("close");
        },

        async save() {
            const paymentMethodUpdate = {
                enabled: this.enabled,
                name: this.name,
                image: this.image,
            };

            // Update
            if (this.paymentMethod) {
                await PaymentMethodEndpoints.put(
                    this.paymentMethod.id,
                    paymentMethodUpdate
                ).catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$t("Can't update the payment method")
                    )
                );
            } else {
                // Create
                await PaymentMethodEndpoints.post(paymentMethodUpdate).catch(
                    () =>
                        this.$store.dispatch(
                            "setGlobalError",
                            this.$t("Can't create the payment method")
                        )
                );
            }
            this.resetForms();
            this.$emit("save");
        },
    },
};
</script>
