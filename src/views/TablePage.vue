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
                    @change="onLocalChange"
                />
            </v-col>
        </v-row>

        <v-row v-if="selectedLocal">
            <v-col md="12">
                <div
                    @click="handleLocalClicked"
                    class="local-item"
                    :style="{
                        'background-image': `url(${getSelectedLocal.imatge})`,
                    }"
                >
                    <span
                        v-for="table in tables"
                        :key="table.id"
                        class="table-item"
                        @click="handleTableClick"
                    />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.local-item {
    height: 750px;
    background-size: contain;
    background-position: center center;
}

.table-item {
    position: absolute;
    height: 24px;
    background-size: contain;
    background-position: center center;
    background-image: url("@/assets/diningTable.jpg");
}
</style>

<script>
import BreadCrumb from "../components/BreadCrumb";
import LocalEndpoints from "../axios/api/local";
import TableEndpoints from "../axios/api/table";

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
            tables: [],
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
                    const localId = data[0].id;
                    this.selectedLocal = localId;
                    this.onLocalChange(localId);
                })
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load locals")
                    )
                );
        },

        onLocalChange(newValue) {
            // Load table for that local
            TableEndpoints.list({ local: newValue })
                .then(({ data }) => (this.tables = data))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load tables")
                    )
                );
        },

        handleLocalClicked() {},

        handleTableClick() {},
    },
};
</script>
