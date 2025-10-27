<template>
  <v-bottom-navigation
    v-if="user_check && isMobile"
    app
    color="primary"
    grow
    height="70"
    class="bottom-nav"
    :model-value="currentRoute"
  >
    <v-btn
      :to="{ name: 'customers_consultant' }"
      value="customers_consultant"
      class="nav-item"
    >
      <v-icon size="24">mdi-account</v-icon>
      <span class="nav-text">مشاوره</span>
    </v-btn>

    <v-btn
      :to="{ name: 'customers_seller' }"
      value="customers_seller"
      class="nav-item"
    >
      <v-icon size="24">mdi-account-voice</v-icon>
      <span class="nav-text">فروش</span>
    </v-btn>

    <v-btn
      :to="{ name: 'index' }"
      value="index"
      class="nav-item"
    >
      <v-icon size="24">mdi-view-grid</v-icon>
      <span class="nav-text">داشبورد</span>
    </v-btn>

    <v-btn
      :to="{ name: 'reports' }"
      value="reports"
      class="nav-item"
    >
      <v-icon size="24">mdi-file-document-outline</v-icon>
      <span class="nav-text">گزارشات</span>
    </v-btn>

    <v-btn
      :to="{ name: 'reminders' }"
      value="reminders"
      class="nav-item"
    >
      <v-icon size="24">mdi-bell-outline</v-icon>
      <span class="nav-text">یاداور ها</span>
    </v-btn>

    <v-btn
      :to="{ name: 'profile' }"
      value="profile"
      class="nav-item"
    >
      <v-icon size="24">mdi-cog</v-icon>
      <span class="nav-text">پروفایل</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import { Stores_Auth } from "@/stores/auth/auth.js";

export default {
  name: "Template_Bottom_Navigation",
  data() {
    return {
      user_check: Stores_Auth().AuthGetCheckAuth,
    };
  },
  computed: {
    isMobile() {
      return !this.$vuetify.display.mdAndUp;
    },
    currentRoute() {
      return this.$route.name;
    }
  }
};
</script>

<style scoped>
.bottom-nav {
  border-top: 1px solid #e0e0e0;
  background-color: white !important;
}

.nav-item {
  flex-direction: column;
  min-width: 0;
  padding: 8px 4px;
}

.nav-text {
  font-size: 11px;
  margin-top: 4px;
  color: #616161;
  font-weight: 500;
}

/* Active state styling - matches the blue color from the design */
.v-btn--active .nav-text {
  color: #1976d2 !important;
  font-weight: 600;
}

.v-btn--active .v-icon {
  color: #1976d2 !important;
}

/* Default inactive state - matches the gray color from the design */
.nav-item .nav-text {
  color: #616161;
}

.nav-item .v-icon {
  color: #616161;
}

/* Hover effects */
.nav-item:hover .nav-text {
  color: #1976d2;
}

.nav-item:hover .v-icon {
  color: #1976d2;
}
</style>
