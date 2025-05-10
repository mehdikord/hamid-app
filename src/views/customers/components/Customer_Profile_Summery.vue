<script>
import {Stores_Customer} from "@/stores/customers/customers.js";

export default {
  name: "Customer_Profile_Summery",
  mounted() {
    this.Get_Repots();
    this.Get_Invoices();
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

    },
    Get_Invoices(){
      Stores_Customer().Invoices_Latest(this.params).then(res => {
        this.invoices = res.data.result;
        this.loading_invoices = false;
      }).catch(error => {
        this.Notify_Error_Server();
      })

    },



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
        <strong class="ms-2 text-teal-darken-2">آخرین گزارشات ثبت شده برای مشتری ( 5 گزارش )</strong>
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
          <template v-if="reports.length">
            <div v-for="report in reports" class="animate__animated animate__zoomInDown">
              <report_single class="mb-6" :report="report"></report_single>
            </div>
          </template>
          <template v-else>
            <div class="mb-8 text-center">
              <v-alert
                  border="top"
                  color="teal-darken-2"
                  variant="tonal"
                  prominent
              >
                <strong>
                  هنوز هیچ گزارشی برای این مشتری ثبت نگردیده است !
                </strong>
              </v-alert>
            </div>
          </template>


        </template>
      </div>
    </div>
    <div class="mt-7">
      <div>
        <v-icon icon="mdi-currency-usd" color="orange-darken-4" class="font-32"></v-icon>
        <strong class="ms-2 text-deep-orange-darken-2">آخرین فاکتور های ثبت شده برای مشتری ( 5 فاکتور )</strong>
      </div>
      <div class="mt-6">
        <template v-if="loading_invoices">
          <v-skeleton-loader
              v-for="i in 3"
              class="mx-auto mb-4"
              elevation="0"
              type="article,actions"

          ></v-skeleton-loader>

        </template>
        <template v-else>
          <template v-if="invoices.length">
            <div v-for="invoice in invoices" class="animate__animated animate__zoomInDown">

              <invoice_single class="mb-6" :invoice="invoice"></invoice_single>

            </div>

          </template>
          <template v-else>
            <div class="mb-8 text-center">
              <v-alert
                  border="top"
                  color="orange-darken-4"
                  variant="tonal"
                  prominent
              >
                <strong>
                  هنوز هیچ فاکتوری برای این مشتری ثبت نگردیده است !
                </strong>
              </v-alert>
            </div>
          </template>

        </template>
      </div>

    </div>


  </template>




</template>

<style scoped>

</style>