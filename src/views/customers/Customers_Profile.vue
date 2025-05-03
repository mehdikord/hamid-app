<script>
import {Stores_Customer} from "@/stores/customers/customers.js";
import profileBg from '@/assets/images/backgrounds/custoemer-bg.png';
import Profile from '@/assets/images/icons/customer.svg'
import Customer_Profile_Summery from "@/views/customers/components/Customer_Profile_Summery.vue";

export default {
  name: "Customers_Profile",
  components:{
    'profile_summery' : Customer_Profile_Summery,
  },
  mounted() {
    this.Get_Customer();
  },
  data(){
    return {
      profileBg,
      Profile,
      loading: true,
      customer:null,
      edit_dialog:false,
    }
  },
  methods:{
    Get_Customer(){
      Stores_Customer().Show({id : this.$route.params.id}).then(res=>{
        this.customer = res.data.result;
        this.loading = false;
      }).catch(error=>{
        this.Notify_Error_Server();

      })
    },
    Update_Customer(item){
      this.customer = item;
      this.edit_dialog = false;
      this.Notify_Success('اطلاعات مشتری با موفقیت ویراش گردید')
    }
  }
}
</script>

<template>

  <template v-if="loading">
    <v-skeleton-loader
        class="mt-10"
        elevation="1"
        height="400"
        type="avatar,table-heading, list-item-two-line, image, table-tfoot"
    ></v-skeleton-loader>
  </template>
  <template v-else>
    <v-row class="mt-1">
      <v-col xs="12" md="4" lg="4" xl="3" sm="12" cols="12">
        <v-card flat border rounded class="animate__animated animate__backInDown">
          <v-img
              class="align-end text-white"
              height="165"
              :src="profileBg"
              cover
          >
          </v-img>
          <div class="px-3 pt-4 pb-6">
            <v-row>
              <v-col cols="3">
                <v-avatar class="avatar-image" :image="Profile" size="80"></v-avatar>
              </v-col>
              <v-col cols="9">
                <strong class="font-17">{{  customer.phone}}</strong>
                <div class="mt-1">{{ customer.name ?? '---' }}</div>
              </v-col>
            </v-row>
            <div>
              <div>
                <strong class="text-primary">اطلاعات حقیقی مشتری : </strong>
              </div>
              <div class="mt-6">
                <v-icon icon="mdi-account" color="deep-orange-darken-2" class="font-28 me-2"/>
                <span class="text-grey-darken-2">نام کامل : </span>
                <strong>{{ customer.name ?? '---' }}</strong>
              </div>
              <div class="mt-6">
                <v-icon icon="mdi-instagram" color="deep-orange-darken-2" class="font-28 me-2"/>
                <span class="text-grey-darken-2">اینستاگرام : </span>
                <strong>{{ customer.instagram_id ?? '---' }}</strong>
              </div>
              <div class="mt-6">
                <v-icon icon="mdi-email" color="deep-orange-darken-2" class="font-28 me-2"/>
                <span class="text-grey-darken-2">ایمیل : </span>
                <strong>{{ customer.email ?? '---' }}</strong>
              </div>
              <div class="mt-6">
                <v-icon icon="mdi-briefcase" color="deep-orange-darken-2" class="font-28 me-2"/>
                <span class="text-grey-darken-2">شغل : </span>
                <strong>{{ customer.job ?? '---' }}</strong>
              </div>
              <div class="mt-6">
                <v-icon icon="mdi-note-check" color="deep-orange-darken-2" class="font-28 me-2"/>
                <span class="text-grey-darken-2">علت ثبت : </span>
                <strong>{{ customer.register_reason ?? '---' }}</strong>
              </div>
              <div class="mt-6">
                <v-icon icon="mdi-alert" color="deep-orange-darken-2" class="font-28 me-2"/>
                <span class="text-grey-darken-2">موانع : </span>
                <strong>{{ customer.obstacles ?? '---' }}</strong>
              </div>
              <div class="mt-7 text-center">
                <v-btn prepend-icon="mdi-pen" @click="edit_dialog = true" variant="flat" color="blue-darken-3" rounded class="w-100 pb-8 pt-3" >ویرایش اطلاعات مشتری</v-btn>
              </div>

            </div>
            <v-dialog
                v-model="edit_dialog"
                max-width="1280"
                transition="dialog-top-transition"

            >
              <v-card variant="flat" rounded>
                <v-card-item>
                  <v-btn @click="edit_dialog = false" variant="flat" class="float-end" icon="mdi-close" size="xx-small" color="red-darken-1"></v-btn>
                  <h3>ویرایش اطلاعات حقیقی مشتری</h3>
                </v-card-item>
                <v-divider/>
                <v-card-item>
                  <actions_customer_edit @Updated="(item) => Update_Customer(item)" :customer="customer"></actions_customer_edit>
                </v-card-item>
              </v-card>
            </v-dialog>
          </div>
        </v-card>

      </v-col>
      <v-col xs="12" md="8" lg="8" xl="9" sm="12" cols="12">

        <v-row>
          <v-col class="animate__animated animate__flipInY" >
            <v-card rounded color="indigo" variant="tonal">
              <v-card-item class="pa-5">
                <v-icon icon="mdi-view-dashboard" class="font-40"></v-icon>
                <strong class="ms-2">خلاصه اطلاعات </strong>
              </v-card-item>
            </v-card>
          </v-col>
          <v-col class="animate__animated animate__flipInY" >
            <v-card rounded color="teal" variant="tonal">
              <v-card-item class="pa-5">
                <v-icon icon="mdi-text-box-edit-outline" class="font-40"></v-icon>
                <strong class="ms-2">لیست گزارشات </strong>
              </v-card-item>
            </v-card>
          </v-col>
          <v-col class="animate__animated animate__flipInY" >
            <v-card rounded color="deep-orange-darken-2" variant="tonal">
              <v-card-item class="pa-5">
                <v-icon icon="mdi-currency-usd" class="font-40"></v-icon>
                <strong class="ms-2">لیست فاکتور ها </strong>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>

        <v-card flat border class="mt-6" style="margin-bottom: 120px">
          <v-card-item>
            <profile_summery v-if="this.$route.name === 'customers_profile'" :customer="customer"></profile_summery>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

  </template>

</template>

<style scoped>
.avatar-image{
  bottom : 50px!important;
}
</style>