<template>
    <v-container fluid class="vh-100 light-blue lighten-3">
        <v-row>
            <v-col md="5" class="mx-auto text-center">
                <div class="white rounded-lg elevation-16 pa-3">
                    <h2 class="error--text">{{ $t("404 Page not found") }}</h2>
                    <h3 class="secondary--text">
                        {{
                            $t(
                                "The page you are looking for doesn't exist or an error occured."
                            )
                        }}
                    </h3>
                    <v-img
                        src="@/assets/sad-sushi.jpg"
                        alt="Error page"
                        class="mx-auto mt-4"
                        max-width="80%"
                    />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>
