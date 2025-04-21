<script>
export default {
  name: "App",
}
</script>

<template>
  <v-app>
    <v-locale-provider rtl>
    <v-main>
      <v-container >
        dtdjru
        <router-view />

      <div class="footer">
        <v-container>
          <div class="footer-menu">
            jerhjesil
          </div>
        </v-container>

      </div>
      </v-container>
    </v-main>
    </v-locale-provider>
  </v-app>
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
  padding: 15px 10px;
  border-radius: 10px;
  border: 1px solid rgba(0, 27, 46, 0.3);
  background-color: rgba(255, 255, 255, 0.28);
}


</style>