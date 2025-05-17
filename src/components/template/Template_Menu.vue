<script setup>

</script>

<template>
  <div class="footer">
    <v-container>
      <div class="footer-menu">
        <v-row justify="center" class="footer-dock">
          <div class="text-center footer-item-margin">
            <router-link :to="{name: 'profile'}">
              <img src="@/assets/images/menu/profile.svg" class="menu-svg" :class="{'menu-active' : this.$route.name === 'profile'}" alt="" />
              <div class="text-white font-13 font-weight-600">
                 پروفایل
              </div>
          </router-link>
          </div>
          <div class="text-center footer-item-margin">
            <img src="@/assets/images/menu/notifications.svg" class="menu-svg" alt="">
            <div class="text-white font-13 font-weight-600">
               اعلانات
            </div>
          </div>
          <div class="text-center footer-item-margin">
            <img src="@/assets/images/menu/projects.svg" class="menu-svg" alt="">
            <div class="text-white font-13 font-weight-600">
               پروژه ها
            </div>
          </div>
          <div class="text-center footer-item-margin">
            <router-link :to="{name: 'index'}">
              <img src="@/assets/images/menu/home.svg" class="menu-svg" :class="{'menu-active' : this.$route.name === 'index'}" alt="">
              <div class="text-white font-13 font-weight-600">
                داشبورد
              </div>
            </router-link>
          </div>
          <div class="text-center footer-item-margin">
            <router-link :to="{name: 'customers'}">
              <img src="@/assets/images/menu/customers.svg" class="menu-svg" :class="{'menu-active' : this.$route.name === 'customers'}" alt="">
              <div class="text-white font-13 font-weight-600">
                 شماره ها
              </div>
            </router-link>
          </div>
          <div class="text-center footer-item-margin">
            <img src="@/assets/images/menu/reports.svg" class="menu-svg" alt="">
            <div class="text-white font-13 font-weight-600">
               گزارشات
            </div>
          </div>
          <div class="text-center footer-item-margin">
            <img src="@/assets/images/menu/invoices.svg" class="menu-svg" alt="">
            <div class="text-white font-13 font-weight-600">
               فاکتور ها
            </div>
          </div>

        </v-row>
      </div>
    </v-container>

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