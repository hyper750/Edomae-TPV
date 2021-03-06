import Vue from 'vue';
import VueRouter from "vue-router";
import store from '../store';
import HomePage from "../views/HomePage";
import LoginPage from "../views/LoginPage";
import MealCategoryPage from "../views/MealCategoryPage";
import MealPage from "../views/MealPage";
import PaymentMethodPage from "../views/PaymentMethodPage";
import LocalPage from "../views/LocalPage";
import TablePage from "../views/TablePage";
import DeliveryPage from "../views/DeliveryPage";
import CommandListPage from "../views/CommandListPage";
import PageNotFound from "../views/PageNotFound";
import UserEndpoints from "../axios/api/user";
import i18n from "../translations";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            name: 'Home',
            path: '/',
            component: HomePage,
            meta: {
                title: i18n.t("Operate - Edomae"),
                login: true,
                breadcrumb: [
                    {
                        text: i18n.t('Home'),
                        href: '/',
                        disabled: true,
                    }
                ]
            }
        },
        {
            name: 'Login',
            path: '/login',
            component: LoginPage,
            meta: {
                title: i18n.t("Login - Edomae"),
            }
        },
        {
            name: 'Meal category',
            path: '/mealCategory',
            component: MealCategoryPage,
            meta: {
                title: i18n.t('MealCategory - Edomae'),
                login: true,
                admin: true,
                breadcrumb: [
                    {
                        text: i18n.t('Admin'),
                        disabled: true,
                    },
                    {
                        text: i18n.t('Meal category'),
                        disabled: true,
                        href: '/mealCategory'
                    }
                ]
            }
        },
        {
            name: 'Meal',
            path: '/meal',
            component: MealPage,
            meta: {
                title: i18n.t('Meal - Edomae'),
                login: true,
                admin: true,
                breadcrumb: [
                    {
                        text: i18n.t('Admin'),
                        disabled: true,
                    },
                    {
                        text: i18n.t('Meal'),
                        disabled: true,
                        href: '/meal'
                    }
                ]
            }
        },
        {
            name: 'Payment method',
            path: '/paymentMethod',
            component: PaymentMethodPage,
            meta: {
                title: i18n.t('Payment method - Edomae'),
                login: true,
                admin: true,
                breadcrumb: [
                    {
                        text: i18n.t('Admin'),
                        disabled: true,
                    },
                    {
                        text: i18n.t('Payment method'),
                        disabled: true,
                        href: '/paymentMethod'
                    }
                ]
            }
        },
        {
            name: 'Local',
            path: '/local',
            component: LocalPage,
            meta: {
                title: i18n.t('Local - Edomae'),
                login: true,
                admin: true,
                breadcrumb: [
                    {
                        text: i18n.t('Admin'),
                        disabled: true,
                    },
                    {
                        text: i18n.t('Local'),
                        disabled: true,
                        href: '/local'
                    }
                ]
            }
        },
        {
            name: 'Table',
            path: '/table',
            component: TablePage,
            meta: {
                title: i18n.t('Table - Edomae'),
                login: true,
                admin: true,
                breadcrumb: [
                    {
                        text: i18n.t('Admin'),
                        disabled: true
                    },
                    {
                        text: i18n.t('Table'),
                        disabled: true,
                        href: '/table'
                    }
                ]
            }
        },
        {
            name: 'Delivery',
            path: '/delivery',
            component: DeliveryPage,
            meta: {
                title: i18n.t("Delivery - Edomae"),
                login: true,
                breadcrumb: [
                    {
                        text: i18n.t("Delivery"),
                        disabled: true,
                        href: '/delivery'
                    }
                ]
            }
        },
        {
            name: 'Command List',
            path: '/commandList',
            component: CommandListPage,
            meta: {
                title: i18n.t("Command List - Edomae"),
                login: true,
                breadcrumb: [
                    {
                        text: i18n.t("Command List"),
                        disabled: true,
                        href: '/commandList'
                    }
                ]
            }
        },
        {
            name: 'Page not found',
            path: '/:patchMatch(.*)*',
            component: PageNotFound,
            meta: {
                title: i18n.t('Page not found - Edomae'),
            }
        }
    ]
});

router.afterEach((to) => {
    document.title = to.meta.title || 'Edomae';
});

router.beforeEach(async (to, from, next) => {
    // User not logged in, go to loggin page
    const token = store.getters.getToken;
    if (!token) {
        if (to.meta.login) {
            next({ name: 'Login' });
        }
        else {
            next();
        }
    }
    // Go to home if the user is logged in and tries to go to the login page
    else if (token && to.name === 'Login') {
        next({ name: 'Home' });
    }
    else {
        // Check the token is valid
        await UserEndpoints.getUser()
            .then(({ data }) => {
                store.dispatch('setUser', data);

                // Check admin page and have the proper permission
                if (!data.admin && to.meta.admin) {
                    next({ path: '/pageNotFound' })
                }
                else {
                    next();
                }
            })
            .catch(() => {
                // If an error ocurred getting the user
                // Logout and go login page
                store.dispatch('setToken', null);
                store.dispatch('setUser', null);
                next({ name: 'Login' });
            });
    }
});

export default router;
