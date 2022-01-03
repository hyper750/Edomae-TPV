<template>
    <v-card>
        <v-card-title>
            {{ $t("Payment") }}
        </v-card-title>

        <v-container fluid>
            <v-row>
                <v-col
                    md="6"
                    v-for="paymentMethod in paymentMethods"
                    :key="paymentMethod.id"
                >
                    <PaymentMethodObject
                        :paymentMethod="paymentMethod"
                        @click.native="() => makePayment(paymentMethod)"
                    />
                </v-col>
            </v-row>
        </v-container>

        <v-card-actions>
            <v-btn color="blue darken-1" text @click="closePaymentProcess">
                {{ $t("close") }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import PaymentMethodObject from "../components/PaymentMethodObject";
import PaymentMethodEndpoints from "../axios/api/paymentMethod";
import CommandEndpoints from "../axios/api/command";

export default {
    props: {
        command: Object,
    },

    components: {
        PaymentMethodObject,
    },

    data() {
        return {
            paymentMethods: [],
        };
    },

    mounted() {
        this.loadPaymentMethods();
    },

    methods: {
        loadPaymentMethods() {
            PaymentMethodEndpoints.list({ enabled: true })
                .then(({ data }) => (this.paymentMethods = data))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load payment methods")
                    )
                );
        },

        makePayment(paymentMethod) {
            CommandEndpoints.put(this.command.id, {
                paid: true,
                payment_method: paymentMethod.id,
            })
                .then(() => this.$emit("pay"))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't make the payment")
                    )
                );
        },

        closePaymentProcess() {
            this.$emit("close");
        },
    },
};
</script>
