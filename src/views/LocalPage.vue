<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <BreadCrumb />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-dialog v-model="showCreateDialog" @click:outside="resetCreateLocalDialog">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="success" v-on="on" v-bind="attrs">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                class="bi bi-plus"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
                                />
                            </svg>
                            {{ $t("Add") }}
                        </v-btn>
                    </template>
                    <LocalDialog
                        ref="localCreateDialog"
                        @close="closeCreateDialog"
                        @save="saveCreateDialog"
                    />
                </v-dialog>
            </v-col>
        </v-row>

        <v-dialog v-model="showUpdateDialog" eager>
            <LocalDialog
                :local="updateLocal"
                @close="closeUpdateDialog"
                @save="saveUpdateDialog"
                @delete="deleteObjectDialog"
            />
        </v-dialog>

        <v-row class="mt-2">
            <v-col
                md="4"
                v-for="local in locals"
                :key="local.id"
            >
                <span @click.stop="() => openUpdateDialog(local)">
                    <LocalObject :local="local" />
                </span>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import BreadCrumb from "../components/BreadCrumb";
import LocalEndpoints from "../axios/api/local";
import LocalObject from "../components/LocalObject";
import LocalDialog from "../components/LocalDialog";

export default {
    components: {
        BreadCrumb,
        LocalObject,
        LocalDialog,
    },

    data() {
        return {
            locals: [],
            showCreateDialog: false,
            showUpdateDialog: false,
            updateLocal: null,
        };
    },

    mounted() {
        this.loadLocals();
    },

    methods: {
        loadLocals() {
            LocalEndpoints.list()
                .then(({ data }) => (this.locals = data))
                .catch(() =>
                    this.$store.dispatch(
                        "setGlobalError",
                        this.$i18n.t("Can't list locals")
                    )
                );
        },

        closeCreateDialog() {
            this.showCreateDialog = false;
        },

        saveCreateDialog() {
            this.closeCreateDialog();
            this.loadLocals();
        },

        closeUpdateDialog() {
            this.showUpdateDialog = false;
        },

        saveUpdateDialog() {
            this.closeUpdateDialog()
            this.loadLocals();
        },

        deleteObjectDialog() {
            this.closeUpdateDialog();
            this.loadLocals();
        },

        openUpdateDialog(local) {
            this.updateLocal = local;
            this.showUpdateDialog = true;
        },

        resetCreateLocalDialog() {
            this.$refs.localCreateDialog.close();
        }
    },
};
</script>
