<template>
  <v-app>
    <v-locale-provider rtl>
      <!-- Top black bar commented out for new hover-based navigation -->
      <!-- <v-app-bar v-if="user_check && !isMobile" elevation="0" class="bg-grey-darken-4" app>
        <v-app-bar-nav-icon 
          v-if="!isMobile"
          variant="text" 
          @click.stop="toggleMenu"
        ></v-app-bar-nav-icon>
        <v-toolbar-title>

        </v-toolbar-title>

        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-magnify" variant="text"></v-btn>
          <v-btn icon="mdi-filter" variant="text"></v-btn>
        </template>
        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
      </v-app-bar> -->

      <v-navigation-drawer
          v-if="user_check && !isMobile"
          :rail="rail"
          rail-width="65"
          app
          permanent
          @click="rail = false"
          @mouseenter="onDrawerHover"
          @mouseleave="onDrawerLeave"
          class="hover-navigation-drawer"
      >
        <v-list nav>
          <template_menu :user="user"></template_menu>

        </v-list>
      </v-navigation-drawer>

      <!-- Mobile navigation drawer removed - using bottom navigation instead -->
      <v-main :class="{ 'mobile-main': isMobile }">
        <div class="v-container">

          <router-view />
          <install_prompt></install_prompt>

        </div>
      </v-main>
      
      <!-- Bottom Navigation for Mobile -->
      <template_bottom_navigation></template_bottom_navigation>
    </v-locale-provider>
  </v-app>
</template>

<script>

import { Stores_Auth } from "@/stores/auth/auth.js";
import Template_Menu from "@/components/template/Template_Menu.vue";
import Template_Bottom_Navigation from "@/components/template/Template_Bottom_Navigation.vue";
import InstallPrompt from "@/InstallPrompt.vue";
import { useTitle } from '@/composables/useTitle.js';
import { watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: "App",
  setup() {
    const route = useRoute();
    const { updateTitleFromRoute } = useTitle();
    
    // Watch for route changes
    watch(route, () => {
      updateTitleFromRoute();
    }, { immediate: true });
    
    return {
      // Return any setup data if needed
    };
  },
  data() {
    return {
      user_check: Stores_Auth().AuthGetCheckAuth,
      user: Stores_Auth().AuthGetUser,
      rail: true,
    };
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    }
  },
  methods : {
    onDrawerHover() {
      // Open the drawer when hovering over it
      this.rail = false;
    },
    onDrawerLeave() {
      // Close the drawer when mouse leaves
      this.rail = true;
    }
  },
  components: {
    'template_menu': Template_Menu,
    'template_bottom_navigation': Template_Bottom_Navigation,
    'install_prompt' : InstallPrompt
  },
};
</script>

<style scoped>
.mobile-main {
  padding-bottom: 70px; /* Account for bottom navigation height */
}

.hover-navigation-drawer {
  transition: all 0.3s ease-in-out;
}

.hover-navigation-drawer:hover {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}
</style>

<style>
/* Ensure SweetAlert toasts appear above Vuetify modals */
.swal2-container {
  z-index: 999999 !important;
}

.swal2-toast-container {
  z-index: 999999 !important;
}
</style>
