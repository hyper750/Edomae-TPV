<template>
    <v-container fluid>
        <v-row>
            <v-col md="12">
                <BreadCrumb />
            </v-col>
        </v-row>

        <v-row>
            <v-col md="3">
                <v-select
                    :items="getItems"
                    v-model="selectedLocal"
                    :label="$t('Select the local')"
                />
            </v-col>
        </v-row>

        <v-row v-if="selectedLocal">
            <v-col md="12">
                <div @click="handleLocalClicked">
                    <v-img
                        contain
                        :src="getSelectedLocal.imatge"
                        height="750"
                    />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import BreadCrumb from "../components/BreadCrumb";
import LocalEndpoints from "../axios/api/local";

export default {
    components: {
        BreadCrumb,
    },

    mounted() {
        this.loadLocals();
    },

    data() {
        return {
            locals: [],
            selectedLocal: null,
        };
    },

    computed: {
        getItems() {
            return this.locals.map((local) => {
                let localName = local.name;
                if (!local.enabled) {
                    localName = `${local.name} (${this.$i18n.t("Disabled")})`;
                }
                return {
                    text: localName,
                    value: local.id,
                };
            });
        },

        getSelectedLocal() {
            return this.locals.find(({ id }) => this.selectedLocal === id);
        },
    },

    methods: {
        loadLocals() {
            this.selectedLocal = null;

            LocalEndpoints.list()
                .then(({ data }) => {
                    this.locals = data;
                    this.selectedLocal = data[0].id;
                })
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load locals")
                    )
                );
        },

        handleLocalClicked() {},
    },
};
</script>
