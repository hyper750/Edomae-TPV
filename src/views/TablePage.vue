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

        <v-dialog v-model="showTableDialog">
            <TableDialog
                :table="selectedTable"
                :local="selectedLocal"
                :xCoordinates="xCoordinates"
                :yCoordinates="yCoordinates"
                @close="closeTableDialog"
                @save="saveTableDialog"
                @delete="deleteTableDialog"
            />
        </v-dialog>

        <v-row v-show="selectedLocal">
            <v-col md="12">
                <div
                    @dblclick="handleLocalClicked"
                    class="local-item"
                    :style="{
                        'background-image': `url(${getSelectedLocalImatge})`,
                    }"
                    ref="localImatge"
                >
                    <span
                        v-for="table in tables"
                        :key="table.id"
                        class="table-item"
                        :class="{ disabledOpacity: !table.enabled }"
                        :style="{
                            top: getYCoordinates(table.y_coordinates),
                            left: getXCoordinates(table.x_coordinates),
                        }"
                        @click="() => handleTableClick(table)"
                    />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.local-item {
    height: 750px;
    background-position: center center;
    background-size: contain;
}

.table-item {
    position: relative;
    display: inline-block;
    height: 64px;
    width: 64px;
    background-size: contain;
    background-image: url("@/assets/diningTableWhite.png");
    cursor: pointer;
}
</style>

<script>
import BreadCrumb from "../components/BreadCrumb";
import TableDialog from "../components/TableDialog";
import LocalEndpoints from "../axios/api/local";
import TableEndpoints from "../axios/api/table";

export default {
    components: {
        BreadCrumb,
        TableDialog,
    },

    mounted() {
        this.loadLocals();
    },

    data() {
        return {
            locals: [],
            selectedLocal: null,
            
            tables: [],
            selectedTable: null,
            showTableDialog: false,

            xCoordinates: null,
            yCoordinates: null,
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

        getSelectedLocalImatge() {
            const selectedLocal = this.getSelectedLocal;
            return (selectedLocal) ? selectedLocal.imatge : '';
        }
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

        handleLocalClicked(event) {
            this.selectedTable = null;
            const rect = event.target.getBoundingClientRect();

            const xCoordinates = event.clientX - rect.left;
            const yCoordinates = event.clientY - rect.top;

            const elementWidth = event.currentTarget.offsetWidth;
            const elementHeight = event.currentTarget.offsetHeight;

            const yRelation = (yCoordinates / elementHeight) * 100;
            const xRelation = (xCoordinates / elementWidth) * 100;

            // Set coordinates
            this.xCoordinates = xRelation;
            this.yCoordinates = yRelation;

            // Open dialog
            this.showTableDialog = true;
        },

        handleTableClick(tableClicked) {
            this.selectedTable = tableClicked;
            this.showTableDialog = true;
        },

        closeTableDialog() {
            this.showTableDialog = false;
        },

        saveTableDialog() {
            this.closeTableDialog();
            this.onLocalChange(this.selectedLocal);
        },

        deleteTableDialog() {
            this.closeTableDialog();
            this.onLocalChange(this.selectedLocal);
        },

        getYCoordinates(yCoordinates) {
            const imatgeHeight = 64;
            const elementHeight = this.$refs.localImatge.offsetHeight;
            const position = ((yCoordinates * elementHeight) / 100) - (imatgeHeight / 2);
            return `${position}px`;
        },

        getXCoordinates(xCoordinates) {
            const imatgeWidth = 64;
            const elementWidth = this.$refs.localImatge.offsetWidth;
            const position =  ((xCoordinates * elementWidth) / 100) - (imatgeWidth / 2);
            return `${position}px`;
        },
    },
};
</script>
