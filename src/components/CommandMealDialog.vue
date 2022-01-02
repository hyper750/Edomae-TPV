<template>
    <v-card max-width="400">
        <v-card-title>
            {{ $t("Adding meal") }}
        </v-card-title>

        <v-img
            :src="meal.imatge"
            height="250"
            :class="{ disabledOpacity: !meal.enabled }"
        />

        <v-container fluid class="mt-2">
            <v-row>
                <v-col md="12 text-center">
                    <h3 class="d-inline ml-10">{{ meal.name }}</h3>
                    <h4 class="d-inline float-right mr-1 mt-1">
                        {{ meal.price }}&euro;
                    </h4>
                </v-col>
            </v-row>
        </v-container>

        <v-card-text>
            <v-container fluid class="mt-2">
                <v-row>
                    <v-col md="12">
                        <v-text-field
                            v-model.number="number"
                            type="number"
                            :label="$t('Number of meals')"
                            :rules="numberRules"
                        />
                    </v-col>
                    <v-col md="12">
                        <v-text-field
                            v-model="extra"
                            :label="$t('Add extras')"
                        />
                    </v-col>
                    <v-col md="12">
                        <v-text-field
                            v-model.number="discount"
                            type="number"
                            :label="$t('Add discount')"
                            :rules="discountRules"
                        />
                    </v-col>
                </v-row>
            </v-container>
            <v-card-actions>
                <v-btn @click="close" color="blue darken-1" text>
                    {{ $t("Close") }}
                </v-btn>
                <v-spacer />
                <v-btn @click="addMeal" color="blue darken-1" text>
                    {{ $t("Add meal") }}
                </v-btn>
            </v-card-actions>
        </v-card-text>
    </v-card>
</template>

<script>
import CommandMeal from "../axios/api/commandMeal";

export default {
    props: {
        meal: Object,
        command: Object,
    },

    data() {
        return {
            number: 1,
            numberRules: [
                (d) =>
                    d > 0 ||
                    this.$i18n.t("The number of meals must be greater than 0"),
            ],

            extra: null,

            discount: null,
            discountRules: [
                (d) =>
                    (d >= 0 && d <= 100) ||
                    this.$i18n.t("The discount must be from 0 to 100"),
            ],
        };
    },

    methods: {
        resetForm() {
            this.number = 1;
            this.extra = null;
            this.discount = null;
        },

        close() {
            this.resetForm();
            this.$emit("close");
        },

        addMeal() {
            const commandMealData = {
                command: this.command.id,
                meal: this.meal.id,
                number: this.number,
                extra: this.extra,
                discount: this.discount,
            };
            CommandMeal.post(commandMealData)
                .then(() => this.$emit("mealAdded"))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't add meal")
                    )
                );
            
            this.resetForm();
        },
    },
};
</script>
