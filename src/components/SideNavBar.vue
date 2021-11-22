<template>
    <v-navigation-drawer app>
        <v-list-item>
            <v-list-item-content>
                <v-list-item-title>
                    <router-link :to="{ name: 'Home' }">
                        <v-img src="@/assets/logo.png" alt="Edomae logo" />
                    </router-link>
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-divider />

        <v-list dense nav>
            <v-list-item-group color="primary" v-model="selectedItemMenu">
                <v-list-item
                    v-for="(page, index) in pageList"
                    :key="index"
                    link
                    :to="page.link"
                >
                    <v-list-item-icon>
                        <v-icon>{{ page.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ $t(page.name) }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import UserEndpoints from "../axios/api/user";

export default {
    name: "SideNavBar",

    data() {
        return {
            pageList: [
                {
                    name: "Home",
                    link: "/",
                    icon: "mdi-home",
                },
                {
                    name: "Meal Category",
                    link: "/mealCategory",
                    icon: "mdi-antenna",
                },
            ],
            selectedItemMenu: null,
        };
    },

    mounted() {
        // TODO: Always on home :/
        const routeName = this.$route.name;
        this.selectedItemMenu = this.pageList.findIndex(
            ({ link }) => link === routeName
        );
    },

    computed: {
        username() {
            const user = this.$store.getters.getUser;
            return user ? user.username : "";
        },

        isUserAdmin() {
            const user = this.$store.getters.getUser;
            return user ? user.admin : false;
        },
    },

    methods: {
        isPageActive(page) {
            return this.$route.name === page;
        },
        async logout() {
            await UserEndpoints.logout();
            this.$store.dispatch("setToken", null);
            this.$store.dispatch("setUser", null);
            this.$router.push({ name: "Login" });
        },
    },
};
</script>
