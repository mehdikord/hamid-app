<script>

import {Stores_Customer} from "@/stores/customers/customers.js";
import {de} from "vuetify/locale";

export default {
  name: "Action_Customer_Invoice_Create",
  computed: {
    de() {
      return de
    }
  },
  props:{
    customer : {
      type: Object,
      required: true
    }
  },
  mounted() {
    const now = moment();
    this.date = now.format("YYYY-MM-DD HH:mm");
  },
  data(){
    return {
      loading:false,
      price:null,
      date:null,
      description:null,
      errors:[]

    }
  },
  methods:{
    Create_Invoice(){
      this.loading=true;
      let params = {
        customer_id : this.customer.project_customer_id,
        date : this.date,
        price : this.price,
        description : this.description,
      }
      Stores_Customer().Invoices_Store(params).then(res=>{
        this.loading=false;
        this.$emit('Created',res.data.result);
      }).catch(error => {
        if (error.response.status === 422) {
          this.errors=error.response.data;
          this.Notify_Error_Validation()
        }else {
          this.Notify_Error_Server()
        }
        this.loading=false;
      })

    }
  }

}
</script>

<template>
  <div class="mt-2">
    <div class="mb-4">
      <span>مبلغ معامله ثبت شده برای مشتری : </span> <strong class="text-indigo font-16">{{ this.$filters.number_format(this.customer.target_price) }}</strong> <span class="text-grey font-13">تومان</span>
    </div>
    <div class="mb-3">
      <v-text-field   :error="Validation_Check(errors,'price')" v-model="price" append-inner-icon="mdi-currency-usd" rounded variant="outlined" type="number" label="مبلغ فاکتور ( تومان )" />
      <validation_errors :errors="Validation_Errors(errors,'price')"></validation_errors>

    </div>
    <div class="mb-3">
      <v-textarea
      variant="outlined"
      rows="3"
      label="توضیحات ( اختیاری )"
      v-model="description"
      color="blue"
      rounded
      :error="Validation_Check(errors,'description')"
      >
      </v-textarea>
      <validation_errors :errors="Validation_Errors(errors,'description')"></validation_errors>
    </div>
    <div class="mb-3">
      <date-picker  :error="Validation_Check(errors,'file')" compact-time auto-submit color="#5c6bc0"  type="datetime" label="انتخاب تاریخ و زمان" v-model="date" format="YYYY-MM-DD HH:mm" display-format="jYYYY-jMM-jDD HH:mm" />
      <validation_errors :errors="Validation_Errors(errors,'date')"></validation_errors>
    </div>
    <div class="mt-6 mb-2 text-end">
      <v-btn :loading="loading" color="success" append-icon="mdi-check" text="ثبت گزارش" flat  rounded @click="Create_Invoice"></v-btn>
    </div>

  </div>
</template>

<style scoped>

</style>