<template>
  <v-app>
    <v-locale-provider rtl>
      <v-app-bar v-if="user_check" elevation="0" class="bg-grey-darken-4" app>
        <v-app-bar-nav-icon variant="text" @click.stop="rail = !rail"></v-app-bar-nav-icon>
        <v-toolbar-title>

        </v-toolbar-title>

        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-magnify" variant="text"></v-btn>
          <v-btn icon="mdi-filter" variant="text"></v-btn>
        </template>

        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
      </v-app-bar>

      <v-navigation-drawer
          v-if="user_check"
          :rail="rail"
          rail-width="65"
          app
          permanent
          @click="rail = false"

      >
        <v-list nav>
          <v-list-item
          >
            <template v-slot:prepend>
              <v-avatar >
                <img src="/src/assets/images/icons/profile.svg" width="100%" alt="">
              </v-avatar>
            </template>
            <template v-slot:title>
              <strong class="font-16">{{ user.name }}</strong>
            </template>
            <template v-slot:subtitle>
              <div class="font-13 mt-1">{{ user.phone }}</div>
            </template>
          </v-list-item>
          <v-divider class="mb-2"/>
          <v-list-item
              :to="{name : 'customers'}"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi mdi-account-group" size="30" color="deep-orange-darken-2">
              </v-icon>
            </template>
            <template v-slot:title>
              <div class="mt-1">
                <strong class="font-14">شماره ها</strong>
              </div>
            </template>
          </v-list-item>


        </v-list>
      </v-navigation-drawer>
      <v-main>
        <div class="v-container">
          <router-view />

        </div>
      </v-main>
    </v-locale-provider>
  </v-app>
</template>

<script>
import Template_Menu from "@/components/template/Template_Menu.vue";
import Template_App_Bar from "@/components/template/Template_App_Bar.vue";
import { Stores_Auth } from "@/stores/auth/auth.js";

export default {
  name: "App",
  data() {
    return {
      user_check: Stores_Auth().AuthGetCheckAuth,
      user: Stores_Auth().AuthGetUser,
      rail: true,
    };
  },
  components: {

  },
};
</script>

<style scoped>
.main-content {
  overflow-y: auto;
  height: calc(100vh - 64px); /* بسته به ارتفاع app-bar */
}
</style>
