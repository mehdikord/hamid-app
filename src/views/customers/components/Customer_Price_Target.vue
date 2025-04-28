<script>
import {Stores_Customer} from "@/stores/customers/customers.js";

export default {
  name: "Customer_Price_Target",
  props: {
    customer:{
      type:Object,
      required:true
    }
  },
  data() {
    return {
      loading:false,
      price:null,
    }
  },
  methods: {
    Update_Price(){
      if (!this.price){
        return this.Notify_Error('مبلغ مورد نظر را وارد کنید !');
      }
      this.loading=true;
      Stores_Customer().Invoices_Target_Price({customer_id : this.customer.project_customer_id,price:this.price}).then((res)=>{
        this.loading=false;
        this.$emit('Updated',res.data.result);
      }).catch((error)=>{

      })
    }
  }
}
</script>

<template>
  <div v-if="customer">
    <v-alert
        color="indigo"
        icon="mdi-alert"
        theme="dark"
        border
    >
      برای ثبت فاکتور برای مشتری ، ابتدا باید مبلغ معامله مشتری را مشخص کنید و سپس فاکتور های مورد نظر را ثبت کنید
    </v-alert>
    <div class="mt-6">
      <v-text-field v-model="price" append-inner-icon="mdi-currency-usd" rounded variant="outlined" type="number" label="وارد کردن مبلغ معامله ( تومان )" placeholder="1,500,000" />
    </div>
    <div class="text-end mt-4 mb-2">
      <v-btn :loading="loading" @click="Update_Price" color="success" append-icon="mdi-check" text="ثبت مبلغ معامله" rounded flat></v-btn>
    </div>


  </div>
</template>

<style scoped>

</style>