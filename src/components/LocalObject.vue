<template>
    <v-hover v-slot="{ hover }">
        <v-card
            class="cursor-pointer mb-4"
            :class="{ 'elevation-12': hover, 'elevation-6': !hover }"
        >
            <v-img
                :src="local.imatge"
                height="250"
                :class="{ disabledOpacity: !local.enabled }"
            />

            <v-card-title>
                {{ local.name }}
            </v-card-title>
        </v-card>
    </v-hover>
</template>

<script>
export default {
    props: {
        local: Object,
    },
};
</script>
