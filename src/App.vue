<template>
    <v-app>
        <SideNavBar />
        <v-main>
            <router-view />
            <v-snackbar v-model="showError" :timeout="snackbarTimeout">
                {{ getGlobalError }}

                <template v-slot:action="{ attrs }">
                    <v-btn
                        color="blue"
                        text
                        v-bind="attrs"
                        @click="showError = false"
                    >
                        {{ $t('Close') }}
                    </v-btn>
                </template>
            </v-snackbar>
        </v-main>
    </v-app>
</template>

<script>
import SideNavBar from "./components/SideNavBar";
import { mapGetters } from "vuex";

export default {
    components: {
        SideNavBar,
    },

    data() {
        return {
            snackbarTimeout: 5000
        };
    },

    computed: {
        ...mapGetters(["getShowGlobalError", "getGlobalError"]),

        showError: {
            get() {
                return this.getShowGlobalError;
            },
            set(show) {
                this.$store.dispatch("setShowGlobalError", show);
            },
        },
    },
};
</script>
