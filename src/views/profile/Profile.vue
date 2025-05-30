<script>
import profileBg from '@/assets/images/backgrounds/profile-bg.jpg';
import Profile from '@/assets/images/icons/profile.svg';
import {Stores_Profile} from "@/stores/profile/profile.js";

export default {
  name: "Profile",
  mounted() {
    this.Get_Profile();
  },
  data(){
    return {
      profileBg,
      Profile,
      loading:true,
      user : null,
    }
  },
  methods : {
   Get_Profile(){
     Stores_Profile().Profile().then(res => {
       this.user = res.data.result;
       this.loading = false;
     }).catch(error => {
       this.Notify_Error_Server('خطا در دریافت اطلاعات');
     });
   }

  }

}

</script>

<template>
  <v-row>
    <v-col xs="12" md="4" lg="4" xl="3" sm="12" cols="12">
      <v-skeleton-loader v-if="loading"
          class="mx-auto border"
          type="card-avatar,"
      ></v-skeleton-loader>
      <v-card v-else flat border rounded class="animate__animated animate__backInDown">
        <v-img
            class="align-end text-white"
            height="165"
            :src="profileBg"
            cover
        >
        </v-img>
        <div class="px-3 pt-4">
            <v-row>
              <v-col cols="3">
                <v-avatar class="avatar-image" :image="Profile" size="85"></v-avatar>
              </v-col>
              <v-col cols="9">
                <v-btn variant="flat" icon="mdi-logout" color="red" rounded class="float-start ms-2" size="30"></v-btn>
                <v-btn variant="flat" icon="mdi-pen" color="blue-darken-3" rounded class="float-start" size="30"></v-btn>
                <strong class="color-orange-text font-15">{{ user.name }}</strong>
                <div class="mt-1">{{ user.phone }}</div>
              </v-col>
            </v-row>
          </div>
      </v-card>

    </v-col>
    <v-col xs="12" md="8" lg="8" xl="9" sm="12" cols="12">
      asdasdasd
    </v-col>
  </v-row>
</template>

<style scoped>
.avatar-image{
  bottom : 50px!important;
}
</style>