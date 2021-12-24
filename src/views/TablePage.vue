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

        <v-dialog v-model="showTableDialog" eager @click:outside="resetTableDialog">
            <TableDialog
                ref="tableDialog"
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
                    @dblclick="(event) => handleLocalClicked(event)"
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
                        @click="() => handleTableClick(table)"
                        draggable
                        @dragstart="(event) => startDragTable(event)"
                        @dragend="(event) => endDragTable(event, table)"
                    >
                        <span class="green--text font-weight-bold white rounded-circle">
                            {{ table.number }}
                        </span>
                    </span>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

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

            startDragXCoordinates: null,
            startDragYCoordinates: null,
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
            return selectedLocal ? selectedLocal.imatge : "";
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
                .then(({ data }) => {
                    // Set small timeout to avoid to draw the tables when there are transitions in progress
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

        handleLocalClicked(event) {
            this.selectedTable = null;
            const rect = event.target.getBoundingClientRect();

            // Relative coordinates and not absolute
            const pxCoordinates = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };

            const localImatgeSize = {
                width: event.currentTarget.offsetWidth,
                height: event.currentTarget.offsetHeight,
            };

            // Percentage of coordinates inside the imatge
            const relation = {
                x: (pxCoordinates.x / localImatgeSize.width) * 100,
                y: (pxCoordinates.y / localImatgeSize.height) * 100,
            };

            // Set coordinates
            this.xCoordinates = relation.x;
            this.yCoordinates = relation.y;

            // Open dialog
            this.showTableDialog = true;
        },

        handleTableClick(tableClicked) {
            this.selectedTable = tableClicked;
            this.showTableDialog = true;
        },

        resetTableDialog() {
            this.$refs.tableDialog.close();
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

        startDragTable(event) {
            const rect = event.target.getBoundingClientRect();
            this.startDragXCoordinates = event.clientX - rect.left;
            this.startDragYCoordinates = event.clientY - rect.top;
        },

        async endDragTable(event, table) {
            // Local imatge size
            const imatgeLocal = this.$refs.localImatge;
            const elementWidth = imatgeLocal.offsetWidth;
            const elementHeight = imatgeLocal.offsetHeight;

            // Get real px
            const tablePxCoordinates = {
                x: (table.x_coordinates * elementWidth) / 100,
                y: (table.y_coordinates * elementHeight) / 100,
            };

            const rect = event.target.getBoundingClientRect();
            // Get coordinates
            const draggedPx = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };

            // Add dragged px to the original table px
            // Minus the original cursor position inside the table
            tablePxCoordinates.x += draggedPx.x - this.startDragXCoordinates;
            tablePxCoordinates.y += draggedPx.y - this.startDragYCoordinates;

            // Relation position
            const relation = {
                x: (tablePxCoordinates.x / elementWidth) * 100,
                y: (tablePxCoordinates.y / elementHeight) * 100,
            };

            await TableEndpoints.put(table.id, {
                x_coordinates: relation.x,
                y_coordinates: relation.y,
            }).catch(() =>
                this.$store.dispatch(
                    "setGlobalError",
                    this.$i18n.t("Can't update the table")
                )
            );

            await this.onLocalChange(this.selectedLocal);
        },
    },
};
</script>
