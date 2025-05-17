<script>
import Template_Menu from "@/components/template/Template_Menu.vue";
import Template_App_Bar from "@/components/template/Template_App_Bar.vue";
import {Stores_Auth} from "@/stores/auth/auth.js";

export default {
  name: "App",
  data(){
    return {
      user_check : Stores_Auth().AuthGetCheckAuth,
      drawer : true
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
    <v-layout>
    <v-locale-provider rtl>
    <v-main>
      <v-container style="max-width: 100%!important;" >

        <v-navigation-drawer
            v-model="drawer"
            location="start"
            :mobile="true"
        >
          <div>

          </div>
        </v-navigation-drawer>
        <template_appbar v-if="user_check" ></template_appbar>
        <router-view />
        <template_menu v-if="user_check"></template_menu>

      </v-container>
    </v-main>
    </v-locale-provider>
    </v-layout>
  </v-app>
</template>

<style scoped>



</style>