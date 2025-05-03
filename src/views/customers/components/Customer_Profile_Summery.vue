<script>
import {Stores_Customer} from "@/stores/customers/customers.js";

export default {
  name: "Customer_Profile_Summery",
  mounted() {
    this.Get_Repots();
  },
  props:{
    customer:{
      type:Object,
      required:true
    }
  },
  data(){
    return {
      params:{
        id : this.customer.id
      },
      loading_reports:true,
      loading_invoices:false,
      reports:[],
      invoices:[],
    }
  },
  methods:{

    Get_Repots(){
      Stores_Customer().Reports_Latest(this.params).then(res => {
        this.reports = res.data.result;
        this.loading_reports = false;
      }).catch(error => {
        this.Notify_Error_Server();


      })

    }



  }
}
</script>

<template>
  <template v-if="customer">

    <div class="mt-2 animate__animated animate__fadeInDown">
      <strong class="font-16">خلاصه اطلاعات مشتری </strong>
    </div>
    <div class="mt-5">
      <div>
        <v-icon icon="mdi-text-box-edit-outline" color="teal-darken-3" class="font-32"></v-icon>
        <strong class="ms-2 text-teal-darken-2">آخرین گزارشات ثبت شده برای مشتری</strong>
      </div>
      <div class="mt-6">
        <template v-if="loading_reports">
          <v-skeleton-loader
              v-for="i in 3"
              class="mx-auto mb-4"
              elevation="0"
              type="article,actions"

          ></v-skeleton-loader>

        </template>
        <template v-else>
          <div v-for="report in reports" class="animate__animated animate__zoomInDown">

            <report_single class="mb-6" :report="report"></report_single>

          </div>

        </template>
      </div>
    </div>
    <div class="mt-7">
      <div>
        <v-icon icon="mdi-currency-usd" color="orange-darken-4" class="font-32"></v-icon>
        <strong class="ms-2 text-deep-orange-darken-2">آخرین فاکتور های ثبت شده برای مشتری</strong>
      </div>

    </div>


  </template>




</template>

<style scoped>

</style>