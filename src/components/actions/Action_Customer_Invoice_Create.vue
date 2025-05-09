<script>

import {Stores_Customer} from "@/stores/customers/customers.js";
import {de} from "vuetify/locale";

export default {
  name: "Action_Customer_Invoice_Create",
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
      target_price:null,
      date:null,
      description:null,
      file:null,
      errors:[]

    }
  },
  methods:{
    Create_Invoice(){
      this.loading=true;
      if (!this.customer.target_price){
        if (!this.target_price){
          return this.Notify_Error('مبلغ معامله را وارد کنید !');
        }
        Stores_Customer().Invoices_Target_Price({customer_id : this.customer.project_customer_id,price:this.target_price}).then((res)=>{
        }).catch((error)=>{
          return this.Notify_Error('خطا در ثبت مبلغ معامله !');
        })
      }
      let params = {
        customer_id : this.customer.project_customer_id,
        date : this.date,
        price : this.price,
        file : this.file,
        description : this.description,
      }
      Stores_Customer().Invoices_Store(params).then(res=>{
        this.loading=false;
        this.$emit('Created',res.data.result);
      }).catch(error => {
        if (error.response.status === 422) {
          this.errors=error.response.data;
          this.Notify_Error_Validation()
        }
        else if (error.response.status === 409) {
          this.Notify_Error(error.response.data.error);

        }
        else {
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
    <template v-if="customer.target_price">
      <div class="mb-4">
        <span>مبلغ معامله ثبت شده برای مشتری : </span> <strong class="text-indigo font-16">{{ this.$filters.number_format(this.customer.target_price) }}</strong> <span class="text-grey font-13">تومان</span>
      </div>
      <div class="mb-4">
        <span>مجموع فاکتور های ثبت شده : </span> <strong class="text-success font-16">{{ this.$filters.number_format(this.customer.sum_invoices) }}</strong> <span class="text-grey font-13">تومان</span>
      </div>
      <div class="mb-6">
        <span>مبلغ باقیمانده : </span> <strong class="text-error font-16">{{ this.$filters.number_format(this.customer.target_price - this.customer.sum_invoices) }}</strong> <span class="text-grey font-13">تومان</span>
      </div>
    </template>
    <template v-else>
      <v-alert
          color="deep-orange-darken-1"
          icon="mdi-alert"
          theme="dark"
          border
      >
        برای ثبت فاکتور برای مشتری ، ابتدا باید مبلغ معامله مشتری را مشخص کنید و سپس فاکتور های مورد نظر را ثبت کنید
      </v-alert>
      <div class="mt-6">
        <v-text-field v-model="target_price" append-inner-icon="mdi-currency-usd" rounded variant="outlined" type="number" label="وارد کردن مبلغ معامله ( تومان )" placeholder="1,500,000" />
      </div>
    </template>
    <div class="mb-3">
      <v-text-field color="blue" :error="Validation_Check(errors,'price')" v-model="price" append-inner-icon="mdi-currency-usd" rounded variant="outlined" type="number" label="مبلغ واریزی ( تومان )" />
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
      <v-file-input v-model="file" hint="فایل های مجاز : تصویر - ویدئو - متن - صوت" color="blue" clearable label="انتخاب فایل" variant="outlined" density="comfortable" rounded ></v-file-input>
      <validation_errors :errors="Validation_Errors(errors,'file')"></validation_errors>
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