<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <BreadCrumb />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-dialog v-model="showCreateDialog" @click:outside="resetCreateDialog">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="success" v-on="on" v-bind="attrs">
                            <v-icon dense class="mr-1">
                                mdi-plus
                            </v-icon>
                            {{ $t("Add") }}
                        </v-btn>
                    </template>
                    <PaymentMethodDialog
                        ref="paymentMethodCreateDialog"
                        @close="closeCreateDialog"
                        @save="saveCreateDialog"
                    />
                </v-dialog>
            </v-col>
        </v-row>

        <v-dialog v-model="showUpdateDialog" eager>
            <PaymentMethodDialog
                :paymentMethod="lastPaymentMethod"
                @close="closeUpdateDialog"
                @save="saveUpdateDialog"
                @delete="deleteUpdateDialog"
            />
        </v-dialog>

        <v-row>
            <v-col
                md="4"
                v-for="paymentMethod in paymentMethodAvailable"
                :key="paymentMethod.id"
            >
                <span @click.stop="() => setLastPaymentMethod(paymentMethod)">
                    <PaymentMethodObject :paymentMethod="paymentMethod" />
                </span>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import BreadCrumb from "../components/BreadCrumb.vue";
import PaymentMethodEndpoints from "../axios/api/paymentMethod";
import PaymentMethodObject from "../components/PaymentMethodObject";
import PaymentMethodDialog from "../components/PaymentMethodDialog";

export default {
    components: {
        BreadCrumb,
        PaymentMethodObject,
        PaymentMethodDialog,
    },

    data() {
        return {
            showCreateDialog: false,
            showUpdateDialog: false,
            paymentMethodAvailable: [],
            lastPaymentMethod: null,
        };
    },

    mounted() {
        this.loadPaymentMethods();
    },

    methods: {
        loadPaymentMethods() {
            PaymentMethodEndpoints.list()
                .then(({ data }) => (this.paymentMethodAvailable = data))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't list payment methods")
                    )
                );
        },

        closeCreateDialog() {
            this.showCreateDialog = false;
        },

        saveCreateDialog() {
            this.closeCreateDialog();
            this.loadPaymentMethods();
        },

        closeUpdateDialog() {
            this.showUpdateDialog = false;
        },

        saveUpdateDialog() {
            this.closeUpdateDialog();
            this.loadPaymentMethods();
        },

        deleteUpdateDialog() {
            this.closeUpdateDialog();
            this.loadPaymentMethods();
        },

        setLastPaymentMethod(paymentMethod) {
            this.showUpdateDialog = true;
            this.lastPaymentMethod = paymentMethod;
        },

        resetCreateDialog() {
            this.$refs.paymentMethodCreateDialog.close();
        },
    },
};
</script>
