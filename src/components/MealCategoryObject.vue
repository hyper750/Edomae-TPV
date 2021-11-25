<template>
    <v-hover v-slot="{ hover }">
        <v-card
            class="cursor-pointer mb-4 bg-white"
            :class="{ 'elevation-12': hover, 'elevation-6': !hover }"
        >
            <v-img
                :src="mealCategory.imatge"
                height="250"
                :class="{ disabledOpacity: !mealCategory.enabled }"
            />

            <v-card-title>
                {{ mealCategory.name }}
            </v-card-title>
        </v-card>
    </v-hover>
</template>

<script>
export default {
    props: {
        mealCategory: Object,
    },
};
</script>
