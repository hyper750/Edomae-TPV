<template>
    <v-navigation-drawer app v-if="isLoggedIn">
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
            <v-list-item
                v-for="(page, index) in pageList"
                :key="index"
                :link="!page.subgroup"
                :to="page.link"
            >
                <v-list-item-icon v-if="!page.subgroup">
                    <v-icon>{{ page.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content v-if="!page.subgroup">
                    <v-list-item-title>
                        {{ $t(page.name) }}
                    </v-list-item-title>
                </v-list-item-content>

                <v-list-group
                    v-if="page.subgroup"
                    :value="false"
                    :prepend-icon="page.icon"
                    style="width: 100%;"
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title>{{ $t(page.name) }}</v-list-item-title>
                        </v-list-item-content>
                    </template>

                    <v-list-item
                        v-for="(subpage, subpageIndex) in page.subgroup"
                        :key="subpageIndex"
                        link
                        :to="subpage.link"
                    >
                        <v-list-item-icon>
                            <v-icon>{{ subpage.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{ $t(subpage.name) }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
            </v-list-item>
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
                    name: "Admin",
                    permissions: [() => this.isUserAdmin],
                    icon: "mdi-wrench",
                    subgroup: [
                        {
                            name: "Meal Category",
                            link: "/mealCategory",
                            icon: "mdi-shape",
                        },
                        {
                            name: 'Meal',
                            link: '/meal',
                            icon: 'mdi-food-fork-drink'
                        }
                    ],
                },
            ],
        };
    },

    computed: {
        isLoggedIn() {
            return this.$store.getters.getToken && this.$store.getters.getUser;
        },
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
