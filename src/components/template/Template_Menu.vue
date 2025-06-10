<script>
export default {
  name: 'Template_Menu',
  data() {
    return {
      drawer: false,
      menuItems: [
        { title: 'پروفایل', icon: '@/assets/images/menu/profile.svg', to: { name: 'profile' } },
        { title: 'اعلانات', icon: '@/assets/images/menu/notifications.svg', to: { name: 'notifications' } },
        { title: 'پروژه ها', icon: '@/assets/images/menu/projects.svg', to: { name: 'projects' } },
        { title: 'داشبورد', icon: '@/assets/images/menu/home.svg', to: { name: 'index' } },
        { title: 'شماره ها', icon: '@/assets/images/menu/customers.svg', to: { name: 'customers' } },
        { title: 'گزارشات', icon: '@/assets/images/menu/reports.svg', to: { name: 'reports' } },
        { title: 'فاکتور ها', icon: '@/assets/images/menu/invoices.svg', to: { name: 'invoices' } }
      ],
      footerImages: [
        { src: '@/assets/images/icons/customer.svg', alt: 'footer-1' },
        { src: '@/assets/images/icons/profile.svg', alt: 'footer-2' }
      ]
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.display.smAndDown
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    },
    closeDrawer() {
      this.drawer = false
    }
  }
}
</script>

<template>
  <div>
    <!-- Mobile header toggle -->
    <v-app-bar flat class="color-dark-bg d-sm-none">
      <v-app-bar-nav-icon @click="toggleDrawer" />
    </v-app-bar>

    <!-- Mobile navigation drawer -->
    <v-navigation-drawer
      v-model="drawer"
      location="start"
      temporary
      class="d-sm-none"
    >
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          @click="closeDrawer"
        >
          <template #prepend>
            <v-img :src="item.icon" width="24" height="24" :alt="item.title" />
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-spacer></v-spacer>
      <div class="pa-4 text-center">
        <v-img
          v-for="(img, index) in footerImages"
          :key="index"
          :src="img.src"
          :alt="img.alt"
          class="mb-2"
          height="32"
        />
      </div>
    </v-navigation-drawer>

    <!-- Desktop footer menu -->
    <div class="footer" v-show="!isMobile">
      <v-container>
        <div class="footer-menu">
          <v-row justify="center" class="footer-dock">
            <div
              v-for="item in menuItems"
              :key="item.title"
              class="text-center footer-item-margin"
            >
              <router-link :to="item.to" @click="closeDrawer">
                <img
                  :src="item.icon"
                  class="menu-svg"
                  :class="{ 'menu-active': $route.name === item.to.name }"
                  :alt="item.title"
                />
                <div class="text-white font-13 font-weight-600">
                  {{ item.title }}
                </div>
              </router-link>
            </div>
          </v-row>
        </div>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
.footer-menu{
  border-radius: 20px;
  border: 1px solid rgb(0, 27, 46);
  background-color: rgba(0, 27, 46, 0.9) !important;

}
.footer-dock{
   padding: 15px 2px 18px 2px;
}
.footer-item-margin{
  margin: 0 48px;
}
.menu-svg{
  width: 45px;
}
.menu-active{
  filter: grayscale(0%) !important;
  opacity: 1;
}
img {
  filter: grayscale(100%);
  opacity: 0.6;
  transition: all 0.3s ease;
}
img:hover {
  filter: grayscale(0%);
  opacity: 1;
}

@media only screen and (max-width: 768px) {
  .footer-item-margin{
    margin: 0 10px;
  }

  .menu-svg{
    width: 30px;
  }
}
</style>