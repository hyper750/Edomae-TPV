import Vue from 'vue';
import VueRouter from "vue-router";
import store from '../store';
import HomePage from "../views/HomePage";
import LoginPage from "../views/LoginPage";
import PageNotFound from "../views/PageNotFound";
import MealCategoryPage from "../views/MealCategoryPage";
import MealPage from "../views/MealPage";
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
            name: 'Register',
            path: '/register',
            component: PageNotFound,
            meta: {
                title: i18n.t('Register - Edomae'),
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
    // TODO: Translate title, useI18n only works for setup()
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
