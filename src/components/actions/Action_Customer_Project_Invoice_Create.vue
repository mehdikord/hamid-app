<script>

import {Stores_Customer} from "@/stores/customers/customers.js";
import {de} from "vuetify/locale";

export default {
  name: "Action_Customer_Project_Invoice_Create",
  props:{
    customer : {
      type: Object,
      required: true
    }
  },
  mounted() {
    const now = moment();
    this.date = now.format("YYYY-MM-DD HH:mm");
    this.Get_Project();
  },
  data(){
    return {
      loading:false,
      price:null,
      target_price:null,
      date:null,
      description:null,
      file:null,
      projects:[],
      project_id:null,
      user_project:null,
      errors:[]

    }
  },
  methods:{
    Create_Invoice(){
      this.loading=true;
      if (this.user_project && !this.user_project.target_price){
        if (!this.target_price){
          return this.Notify_Error('مبلغ معامله را وارد کنید !');
        }
        Stores_Customer().Invoices_Target_Price({customer_id : this.user_project.project_customer_id,price:this.target_price}).then((res)=>{
        }).catch((error)=>{
          return this.Notify_Error('خطا در ثبت مبلغ معامله !');
        })
      }
      let params = {
        customer_id : this.customer.id,
        project_id : this.project_id,
        date : this.date,
        price : this.price,
        file : this.file,
        description : this.description,
      }
      Stores_Customer().Projects_Invoices_Store(params).then(res=>{
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

    },
    Get_Project(){
      Stores_Customer().Projects_Index({id : this.customer.id}).then(res => {
        this.projects = res.data.result;
        if (this.projects){
          this.project_id = this.projects[0].id;
          console.log(this.project_id);
          this.Get_User_Project()
        }
      })

    },
    Get_User_Project(){
      if (this.customer && this.project_id){
        Stores_Customer().Projects_Own({customer_id: this.customer.id,project_id:this.project_id}).then((res)=>{
          this.user_project = res.data.result;
        }).catch(error => {
          this.Notify_Error_Server();
        })

      }
    }
  }

}
</script>

<template>
  <div class="mt-2">
    <div class="mb-3">
      <v-select
          class="mt-3"
          :items="projects"
          v-model="project_id"
          item-title="name"
          item-value="id"
          color="blue"
          variant="outlined"
          density="comfortable"
          label="انتخاب پروژه "
      >

      </v-select>
    </div>
    <template v-if="user_project && user_project.target_price">
      <div class="mb-4">
        <span>مبلغ معامله ثبت شده برای مشتری : </span> <strong class="text-indigo font-15">{{ this.$filters.number_format(this.user_project.target_price) }}</strong> <span class="text-grey font-12">تومان</span>
      </div>
      <div class="mb-4">
        <span>مجموع فاکتور های ثبت شده : </span> <strong class="text-success font-15">{{ this.$filters.number_format(this.user_project.sum_invoices) }}</strong> <span class="text-grey font-12">تومان</span>
      </div>
      <div class="mb-6">
        <span>مبلغ باقیمانده : </span> <strong class="text-error font-15">{{ this.$filters.number_format(this.user_project.target_price - this.user_project.sum_invoices) }}</strong> <span class="text-grey font-12">تومان</span>
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