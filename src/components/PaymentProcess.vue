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
import PaymentMethod from "../axios/api/paymentMethod";
import PaymentMethodObject from "../components/PaymentMethodObject";

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
            PaymentMethod.list({ enabled: true })
                .then(({ data }) => (this.paymentMethods = data))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load payment methods")
                    )
                );
        },

        makePayment(paymentMethod) {
            console.log(paymentMethod);
        },

        closePaymentProcess() {
            this.$emit("close");
        },
    },
};
</script>
