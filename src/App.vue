<script>
import Template_Menu from "@/components/template/Template_Menu.vue";
import Template_App_Bar from "@/components/template/Template_App_Bar.vue";
import {Stores_Auth} from "@/stores/auth/auth.js";

export default {
  name: "App",
  data(){
    return {
      user_check : Stores_Auth().AuthGetCheckAuth,
    }
  },
  components:{
    'template_menu' : Template_Menu,
    'template_appbar' : Template_App_Bar
  }
}
</script>

<template>
  <v-app>
    <v-locale-provider rtl>
    <v-main>
      <v-container >
        <template_appbar v-if="user_check" ></template_appbar>
        <router-view />
        <template_menu v-if="user_check"></template_menu>

      </v-container>
    </v-main>
    </v-locale-provider>
  </v-app>
</template>

<style scoped>



</style>