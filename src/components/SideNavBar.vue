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
                v-for="(page, index) in getPageList"
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
        
        <v-container fluid class="userMenu">
            <v-row>
                <v-col cols="12">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark v-bind="attrs" v-on="on">
                                {{ username }}
                            </v-btn>
                        </template>

                        <v-list>
                            <v-list-item link @click="logout">
                                <v-list-item-icon>
                                    <v-icon>
                                        mdi-logout
                                    </v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{ $t('Logout') }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
        </v-container>
    </v-navigation-drawer>
</template>

<style scoped>
.userMenu {
    position: absolute;
    left: 0;
    bottom: 0;
}
</style>

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
        getPageList() {
            return this.pageList.filter((page) => {
                if( !page.permissions ) {
                    return true;
                }

                let permission = true;
                for(let permissionFunc of page.permissions) {
                    permission &&= permissionFunc();
                }

                return permission;
            });
        },
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
        async logout() {
            await UserEndpoints.logout();
            this.$store.dispatch("setToken", null);
            this.$store.dispatch("setUser", null);
            this.$router.push({ name: "Login" });
        },
    },
};
</script>
