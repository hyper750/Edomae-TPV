<template>
    <v-card>
        <v-card-title>
            {{ $t('Command') }}
        </v-card-title>

        <v-card-text>
            <v-container fluid>
                <v-row>
                    Content
                </v-row>
            </v-container>
        </v-card-text>
        
        <v-card-actions>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props: {
        table: Number,
    },

    watch: {
        table: function(newValue) {
            this.loadCommand(newValue);
        }
    },

    methods: {
        loadCommand(tableId) {
            // Default value is null
            if(!tableId) {
                return;
            }

            // Check if there's a command already on that table
        },
    },
};
</script>
