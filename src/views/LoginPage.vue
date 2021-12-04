<template>
    <v-container fluid class="vh-100">
        <v-row class="vh-100">
            <v-col
                cols="12"
                md="3"
                class="mx-auto my-auto rounded-lg elevation-16 white"
            >
                <div class="ma-3">
                    <v-row>
                        <v-col cols="3" md="3">
                            <v-img src="@/assets/logo.png" alt="Edomae logo" />
                        </v-col>
                        <v-col md="4" cols="4" class="my-auto mx-auto">
                            <h2>{{ $t("Login") }}</h2>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                v-model="username"
                                :label="$t('Username')"
                                required
                                :disabled="isLoading"
                                @keyup.enter="performLogin"
                            />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                type="password"
                                v-model="password"
                                :label="$t('Password')"
                                required
                                :disabled="isLoading"
                                @keyup.enter="performLogin"
                            />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" class="text-right">
                            <v-btn
                                color="primary"
                                :disabled="isLoading"
                                @click="performLogin"
                            >
                                {{ $t("Login") }}
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-row class="mt-2" v-if="error">
                        <v-col md="12">
                            <p class="error--text font-weight-bold text-center">
                                {{ $t(error) }}
                            </p>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import userEndpoints from "../axios/api/user";
import store from '../store';

export default {
    data() {
        return {
            username: null,
            password: null,
            error: null,
            isLoading: false,
        };
    },

    methods: {
        performLogin() {
            this.isLoading = true;
            userEndpoints
                .login(this.username, this.password)
                .then(({ data }) => {
                    store.dispatch("setToken", data.token);
                    this.$router.push({ name: "Home" });
                })
                .catch(() => {
                    this.error = this.$i18n.t("Username or password incorrect");
                })
                .finally(() => {
                    // Clear form
                    this.username = null;
                    this.password = null;
                    // Done
                    this.isLoading = false;
                });
        },
    },
};
</script>
