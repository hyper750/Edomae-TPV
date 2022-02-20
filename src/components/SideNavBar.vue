<template>
    <v-navigation-drawer app v-if="isLoggedIn">
        <v-list>
            <v-list-item class="justify-center">
                <v-list-item-avatar size="64">
                    <v-img src="@/assets/avatar.png" alt="Avatar image" />
                </v-list-item-avatar>
            </v-list-item>
            <v-list-item link>
                <v-menu offset-y>
                    <template v-slot:activator="{ attrs, on }">
                        <v-list-item-content
                            v-bind="attrs"
                            v-on="on"
                            class="ml-4"
                        >
                            <v-list-item-title>
                                {{ username }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ fullname }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-icon>
                            <v-icon>mdi-chevron-down</v-icon>
                        </v-list-item-icon>
                    </template>

                    <v-list dense nav>
                        <v-list-item link>
                            <v-menu offset-y>
                                <template v-slot:activator="{ attrs, on }">
                                    <v-list-item-icon>
                                        <v-icon> mdi-web </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content
                                        v-bind="attrs"
                                        v-on="on"
                                    >
                                        <v-list-item-title>
                                            {{ $t(getCurrentLanguage.text) }}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </template>
                                <v-list dense nav>
                                    <v-list-item
                                        link
                                        v-for="language in getLanguage"
                                        :key="language.code"
                                        @click="
                                            () => changeLanguage(language.code)
                                        "
                                    >
                                        <v-list-item-title>
                                            {{ $t(language.text) }}
                                        </v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </v-list-item>
                        <v-list-item link @click="() => logout()">
                            <v-list-item-icon>
                                <v-icon> mdi-logout </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>{{
                                    $t("Logout")
                                }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-list-item>
        </v-list>

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
                    style="width: 100%"
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title>{{
                                $t(page.name)
                            }}</v-list-item-title>
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
                            <v-list-item-title>{{
                                $t(subpage.name)
                            }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import UserEndpoints from "../axios/api/user";
import { languagesAvailable } from "../translations";

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
                    name: "Delivery",
                    link: "/delivery",
                    icon: "mdi-moped",
                },
                {
                    name: "Command List",
                    link: "/commandList",
                    icon: "mdi-clipboard-list-outline",
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
                            name: "Meal",
                            link: "/meal",
                            icon: "mdi-food-fork-drink",
                        },
                        {
                            name: "Payment Method",
                            link: "/paymentMethod",
                            icon: "mdi-credit-card-outline",
                        },
                        {
                            name: "Local",
                            link: "/local",
                            icon: "mdi-home-map-marker",
                        },
                        {
                            name: "Table",
                            link: "/table",
                            icon: "mdi-table-furniture",
                        },
                    ],
                },
            ],
        };
    },

    computed: {
        getPageList() {
            return this.pageList.filter((page) => {
                if (!page.permissions) {
                    return true;
                }

                let permission = true;
                for (let permissionFunc of page.permissions) {
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

        fullname() {
            const user = this.$store.getters.getUser;
            if (!user) {
                return "";
            }
            return `${user.name} ${user.surname} ${user.lastname}`;
        },

        isUserAdmin() {
            const user = this.$store.getters.getUser;
            return user ? user.admin : false;
        },

        getLanguage() {
            return languagesAvailable;
        },

        getCurrentLanguage() {
            return languagesAvailable.find((l) => l.code === this.$i18n.locale);
        },
    },

    methods: {
        async logout() {
            await UserEndpoints.logout();
            this.$store.dispatch("setToken", null);
            this.$store.dispatch("setUser", null);
            this.$router.push({ name: "Login" });
        },

        changeLanguage(languageLocale) {
            this.$i18n.locale = languageLocale;
            localStorage.setItem('language', languageLocale);
        },
    },
};
</script>
