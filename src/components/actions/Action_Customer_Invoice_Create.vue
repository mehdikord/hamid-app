<script>

import {Stores_Customer} from "@/stores/customers/customers.js";
import {de} from "vuetify/locale";

export default {
  name: "Action_Customer_Invoice_Create",
  props:{
    customer : {
      type: Object,
      required: true
    },
    onCancel: {
      type: Function,
      required: false
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
      formatted_price:'',
      formatted_target_price:'',
      date:null,
      description:null,
      file:null,
      errors:[]

    }
  },
  methods:{
    // Format number with commas every 3 digits
    formatNumber(value) {
      if (!value) return '';
      // Remove all non-numeric characters
      const numericValue = value.toString().replace(/[^\d]/g, '');
      // Add commas every 3 digits
      return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // Parse formatted number back to numeric value
    parseNumber(formattedValue) {
      if (!formattedValue) return null;
      // Remove commas and convert to number
      const numericValue = formattedValue.toString().replace(/,/g, '');
      return numericValue ? parseInt(numericValue) : null;
    },
    
    // Handle price input formatting
    onPriceInput(event) {
      const formatted = this.formatNumber(event.target.value);
      this.formatted_price = formatted;
      this.price = this.parseNumber(formatted);
    },
    
    // Handle target price input formatting
    onTargetPriceInput(event) {
      const formatted = this.formatNumber(event.target.value);
      this.formatted_target_price = formatted;
      this.target_price = this.parseNumber(formatted);
    },
    
    async Create_Invoice(){
      this.loading=true;
      
      // If no target price exists, set it first
      if (!this.customer.target_price){
        if (!this.target_price){
          this.loading=false;
          return this.Notify_Error('مبلغ معامله را وارد کنید !');
        }
        try {
          await Stores_Customer().Invoices_Target_Price({customer_id : this.customer.project_customer_id,price:this.target_price});
          // After successful target price setting, proceed with invoice creation
          this.Create_Invoice_After_Target();
        } catch (error) {
          this.loading=false;
          return this.Notify_Error('خطا در ثبت مبلغ معامله !');
        }
      } else {
        // If target price already exists, proceed directly with invoice creation
        this.Create_Invoice_After_Target();
      }
    },
    
    Create_Invoice_After_Target(){
      // Validate that deposit amount doesn't exceed remaining contract amount
      if (this.customer.target_price) {
        const remainingAmount = this.customer.target_price - this.customer.sum_invoices;
        if (this.price > remainingAmount) {
          this.loading=false;
          return this.Notify_Error(`مبلغ واریزی نمی‌تواند بیشتر از مبلغ باقیمانده (${this.$filters.number_format(remainingAmount)} تومان) باشد!`);
        }
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
        // Close modal after successful creation
        if (this.onCancel) {
          this.onCancel();
        }
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
        <span>مبلغ معامله ثبت شده برای مشتری : </span> <strong class="text-indigo font-15">{{ this.$filters.number_format(this.customer.target_price) }}</strong> <span class="text-grey font-12">تومان</span>
      </div>
      <div class="mb-4">
        <span>مجموع فاکتور های ثبت شده : </span> <strong class="text-success font-15">{{ this.$filters.number_format(this.customer.sum_invoices) }}</strong> <span class="text-grey font-12">تومان</span>
      </div>
      <div class="mb-6">
        <span>مبلغ باقیمانده : </span> <strong class="text-error font-15">{{ this.$filters.number_format(this.customer.target_price - this.customer.sum_invoices) }}</strong> <span class="text-grey font-12">تومان</span>
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
        <v-text-field 
          v-model="formatted_target_price" 
          @input="onTargetPriceInput"
          append-inner-icon="mdi-currency-usd" 
          rounded 
          variant="outlined" 
          type="text" 
          label="وارد کردن مبلغ معامله ( تومان )" 
          placeholder="1,500,000" 
        />
      </div>
    </template>
    <div class="mb-3">
      <v-text-field 
        color="blue" 
        :error="Validation_Check(errors,'price')" 
        v-model="formatted_price" 
        @input="onPriceInput"
        append-inner-icon="mdi-currency-usd" 
        rounded 
        variant="outlined" 
        type="text" 
        :label="customer.target_price ? `مبلغ واریزی ( حداکثر ${this.$filters.number_format(customer.target_price - customer.sum_invoices)} تومان )` : 'مبلغ واریزی ( تومان )'" 
      />
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
      <!-- <date-picker v-model="date" /> -->
      <!-- <date-picker  :error="Validation_Check(errors,'file')" compact-time auto-submit color="#5c6bc0"  type="datetime" label="انتخاب تاریخ و زمان" v-model="date" format="YYYY-MM-DD HH:mm" display-format="jYYYY-jMM-jDD HH:mm" /> -->
      <validation_errors :errors="Validation_Errors(errors,'date')"></validation_errors>
    </div>

    <div class="mt-6 mb-2 text-end">
      <v-btn :loading="loading" color="success" append-icon="mdi-check" text="ثبت گزارش" flat  rounded @click="Create_Invoice"></v-btn>
    </div>

  </div>
</template>

<style scoped>

</style>