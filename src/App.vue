<template>
    <v-app>
        <SideNavBar/>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
import SideNavBar from "./components/SideNavBar";

export default {
    components: {
        SideNavBar,
    },
};
</script>
