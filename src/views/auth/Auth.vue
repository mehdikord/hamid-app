<script>
import {Stores_Auth} from "@/stores/auth/auth.js";

export default {
  name: "Auth",
  data() {
    return {
      loading:false,
      login : {
        phone : null,
        password : null,
      }
    }
  },
  methods: {
    Login(){
      if (!this.login.phone || !this.login.password) {
        this.Notify_Error('اطلاعات ورود را وارد کنید');
        return;
      }
      this.loading = true;
      Stores_Auth().AuthLoginRequest(this.login).then(res => {
        Stores_Auth().AuthLogin(res.data.result.user,res.data.result.token)
        this.Notify_Success('خوش اومدی ' + res.data.result.user.name + ' جان !');
        this.loading = false;
        location.reload();
      }).catch(error => {
        if (error.response.status === 409){
          this.Notify_Error('اطلاعات ورود صحیح نمی باشد');
        }
        this.loading = false;
      });
    }
  }

}
</script>

<template>

  <div class="mt-16">
    <v-row justify="center">
      <v-col xs="12" sm="12" md="12" lg="10" xl="9">
        <v-card flat class="mt-lg-10">
          <v-card-item>
            <v-row>
              <v-col md="6" xs="12" sm="12" class="text-center">
                <v-card  class="color-dark-bg rounded-xl">
                  <v-card-item>
                    <div class="mt-14 mb-6">
                      <strong class="color-orange-text font-20">ورود به حساب کاربری</strong>
                    </div>
                    <div class="text-white font-14">
                      برای ورود شماره موبایل و گذرواژه خود را وارد کنید
                    </div>
                  </v-card-item>
                  <v-card-item @keyup.enter="Login" class="px-lg-12">
                    <div class="mt-4">
                      <v-text-field v-model="login.phone" type="number" label="شماره موبایل" color="white" style="color: white!important;" base-color="white" variant="outlined" rounded prepend-inner-icon="mdi-cellphone font-30" icon-color="deep-orange-lighten-1"></v-text-field>
                    </div>
                    <div class="mt-3">
                      <v-text-field v-model="login.password" type="password" label="گذرواژه" color="white" style="color: white!important;" base-color="white" variant="outlined" rounded prepend-inner-icon="mdi-lock font-30" icon-color="deep-orange-lighten-1"></v-text-field>
                    </div>
                    <div class="mt-4 mb-5">
                      <v-btn  variant="flat" :loading="loading" @click="Login" color="deep-orange" class="font-15 px-12" size="large" rounded append-icon="mdi-check">ورود به حساب</v-btn>
                    </div>
                    <div class="mt-6 mb-10">
                      <strong class="text-grey">فراموشی گذرواژه</strong>
                    </div>
                  </v-card-item>
                </v-card>
              </v-col>
              <v-col class="hidden-xs text-center" md="6" xs="12" sm="12">
                <img src="@/assets/images/backgrounds/auth-bg.svg" width="100%" alt="">
              </v-col>
            </v-row>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>

</style>