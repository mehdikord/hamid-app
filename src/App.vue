<template>
  <v-app>
    <v-locale-provider rtl>
      <v-app-bar v-if="user_check" elevation="0" class="bg-grey-darken-4" app>
        <v-app-bar-nav-icon variant="text" @click.stop="toggleMenu"></v-app-bar-nav-icon>
        <v-toolbar-title>

        </v-toolbar-title>

        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-magnify" variant="text"></v-btn>
          <v-btn icon="mdi-filter" variant="text"></v-btn>
        </template>
        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
      </v-app-bar>

      <v-navigation-drawer
          v-if="user_check && !isMobile"
          :rail="rail"
          rail-width="65"
          app
          permanent
          @click="rail = false"

      >
        <v-list nav>
          <template_menu :user="user"></template_menu>

        </v-list>
      </v-navigation-drawer>

      <v-navigation-drawer
          v-if="user_check && isMobile"
          v-model="mini"
          :mini-variant="!isMobile && mini"
          mini-variant-width="65"
          width="250"
          app
          :permanent="!isMobile"
          :temporary="isMobile"
          @click="isMobile && (mini = false)"
      >
        <v-list nav>
          <template_menu :user="user"></template_menu>
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

import { Stores_Auth } from "@/stores/auth/auth.js";
import Template_Menu from "@/components/template/Template_Menu.vue";

export default {
  name: "App",
  data() {
    return {
      user_check: Stores_Auth().AuthGetCheckAuth,
      user: Stores_Auth().AuthGetUser,
      rail: true,
      mini:true,
    };
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    }
  },
  methods : {
    toggleMenu() {
      if (this.isMobile) {
        this.mini = !this.mini;
      } else {
        this.rail = !this.rail
      }
    }

  },
  components: {
    'template_menu': Template_Menu
  },
};
</script>

<style scoped>

</style>
