<template>
    <v-container fluid>
        <v-row>
            <v-col md="12">
                <BreadCrumb />
            </v-col>
        </v-row>

        <v-dialog v-model="deliveryCommandDialogOpen" eager @click:outside="() => onCommandDialogClose()">
            <DeliveryCommandDialog ref="deliveryCommandDialog"/>
        </v-dialog>

        <v-row>
            <v-col md="12">
                <v-btn color="success" @click="() => openDeliveryCommandDialog()">
                    <v-icon dense class="mr-1"> mdi-plus </v-icon>
                    {{ $t("Add") }}
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import BreadCrumb from "../components/BreadCrumb";
import DeliveryCommandDialog from "../components/DeliveryCommandDialog";

export default {
    components: {
        BreadCrumb,
        DeliveryCommandDialog,
    },

    data() {
        return {
            deliveryCommandDialogOpen: false,
        };
    },

    methods: {
        openDeliveryCommandDialog() {
            this.deliveryCommandDialogOpen = true;
        },

        onCommandDialogClose() {
            this.$refs.deliveryCommandDialog.reset();
        },
    },
};
</script>
