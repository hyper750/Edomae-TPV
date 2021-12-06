<template>
    <v-hover v-slot="{ hover }">
        <v-card
            class="cursor-pointer mb-4 bg-white"
            :class="{ 'elevation-12': hover, 'elevation-6': !hover }"
        >
            <v-img
                :src="paymentMethod.image"
                height="250"
                :class="{ disabledOpacity: !paymentMethod.enabled }"
            />
            <v-card-title>
                {{ paymentMethod.name }}
            </v-card-title>
        </v-card>
    </v-hover>
</template>
<script>
export default {
    props: {
        paymentMethod: Object,
    },
};
</script>
