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
        <router-view />

<!--        <v-bottom-navigation :elevation="8" grow>-->
<!--          <v-btn value="recent">-->
<!--            <v-icon>mdi-history</v-icon>-->

<!--            <span>Recent</span>-->
<!--          </v-btn>-->

<!--          <v-btn value="favorites">-->
<!--            <v-icon>mdi-heart</v-icon>-->

<!--            <span>Favorites</span>-->
<!--          </v-btn>-->

<!--          <v-btn value="nearby">-->
<!--            <v-icon>mdi-map-marker</v-icon>-->

<!--            <span>Nearby</span>-->
<!--          </v-btn>-->
<!--        </v-bottom-navigation>-->
      </v-container>
    </v-main>
    </v-locale-provider>
  </v-app>
</template>

<style scoped>

</style>