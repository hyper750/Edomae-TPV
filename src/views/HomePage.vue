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
                    @change="loadTables"
                />
            </v-col>
        </v-row>

        <v-row v-show="selectedLocal">
            <v-col md="12">
                <div
                    class="local-item"
                    :style="{
                        'background-image': `url(${getSelectedLocalImatge})`,
                    }"
                    ref="localImatge"
                >
                    <span
                        v-for="table in tables"
                        :key="table.id"
                        class="table-item text-center"
                        :class="{ disabledOpacity: !table.enabled }"
                        :style="{
                            top: getYCoordinates(table.y_coordinates),
                            left: getXCoordinates(table.x_coordinates),
                        }"
                    >
                        <span
                            class="
                                green--text
                                font-weight-bold
                                white
                                rounded-circle
                            "
                        >
                            {{ table.number }}
                        </span>
                    </span>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import BreadCrumb from "../components/BreadCrumb.vue";
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
            return this.locals.map((local) => ({
                text: local.name,
                value: local.id,
            }));
        },

        getSelectedLocal() {
            return this.locals.find(({ id }) => this.selectedLocal === id);
        },

        getSelectedLocalImatge() {
            const selectedLocal = this.getSelectedLocal;
            return selectedLocal ? selectedLocal.imatge : "";
        },
    },

    methods: {
        loadLocals() {
            LocalEndpoints.list({ enabled: true })
                .then(({ data }) => {
                    this.locals = data;
                    this.selectedLocal = data[0].id;
                    this.loadTables(data[0].id);
                })
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$$i18n.t("Can't local locals")
                    )
                );
        },

        loadTables(localId) {
            TableEndpoints.list({
                enabled: true,
                local: localId,
            })
                .then(({ data }) => {
                    setTimeout(() => {
                        this.tables = data;
                    }, 100);
                })
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't load tables")
                    )
                );
        },

        getYCoordinates(yCoordinates) {
            const imatgeHeight = 64;
            const elementHeight = this.$refs.localImatge.offsetHeight;
            const position =
                (yCoordinates * elementHeight) / 100 - imatgeHeight / 2;
            return `${position}px`;
        },

        getXCoordinates(xCoordinates) {
            const imatgeWidth = 64;
            const elementWidth = this.$refs.localImatge.offsetWidth;
            // Convert percentage to px, and remove the 1/2 of the imatge height
            const position =
                (xCoordinates * elementWidth) / 100 - imatgeWidth / 2;
            // Convert it to %
            // const positionPercentage = (position / elementWidth) * 100;
            return `${position}px`;
        },
    },
};
</script>
