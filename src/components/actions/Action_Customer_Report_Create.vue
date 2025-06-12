<script>

import {Stores_Customer} from "@/stores/customers/customers.js";
import {Stores_Statuses} from "@/stores/customers/statuses.js";

export default {
  name: "Action_Customer_Report_Create",
  props:{
    customer : {
      type: Object,
      required: true
    }
  },
  mounted() {
    const now = moment();
    this.date = now.format("YYYY-MM-DD HH:mm");
    if(this.customer.status){
      this.status_id = this.customer.status.id;
    }
    if(this.customer.level){
      this.project_level_id = this.customer.level.id;
    }
    this.Get_Statuses();
    this.Get_Levels();

  },
  data(){
    return {
      loading:false,
      report:null,
      date:null,
      file:null,
      project_level_id:null,
      status_id:null,
      statuses : [],
      levels : [],
      errors:[]

    }
  },
  methods:{
    Create_Report(){
      this.loading=true;
      let params = {
        customer_id : this.customer.project_customer_id,
        date : this.date,
        status_id : this.status_id,
        project_level_id : this.project_level_id,
        report : this.report,
        file : this.file,
      }
      Stores_Customer().Reports_Store(params).then(res=>{
        this.loading=false;
        this.$emit('Created',res.data.result);
      }).catch(error => {
        if (error.response.status === 422) {

          this.errors=error.response.data;
          this.Notify_Error_Validation();
        }else {

          this.Notify_Error_Server()

        }

        this.loading=false;
      })

    },
    Get_Statuses(){
      Stores_Statuses().All().then(res =>{
        this.statuses = res.data.result;
      }).catch(error =>{

      })
    },
    Get_Levels(){
      let params = {
        id : this.customer.customer.id,
        project_id: this.customer.project.id,
      }
      Stores_Customer().Projects_Levels(params).then(res =>{
        if (res.data.result){
          this.levels = res.data.result;
        }
      }).catch(error =>{
        return this.Notify_Error('خطا در دریافت مراحل')

      })
    },

  }

}
</script>

<template>
  <div class="mt-3" >
    <div class="mb-3">
      <v-textarea
      variant="outlined"
      rows="3"
      label="متن گزارش"
      v-model="report"
      color="blue"
      :error="Validation_Check(errors,'report')"
      >
      </v-textarea>
      <validation_errors :errors="Validation_Errors(errors,'report')"></validation_errors>
    </div>
    <div class="mb-3">
      <v-select
          class="mt-3"
          :items="levels"
          v-model="project_level_id"
          item-title="name"
          item-value="id"
          color="blue"
          variant="outlined"
          density="comfortable"
          label="انتخاب مرحله مذاکره"
      >
      </v-select>
    </div>
    <div class="mb-3">
      <v-select
          class="mt-3"
          :items="statuses"
          v-model="status_id"
          item-title="name"
          item-value="id"
          color="blue"
          variant="outlined"
          density="comfortable"
          label="انتخاب وضعیت جدید"
      >

      </v-select>
    </div>
    <div class="mb-3">
      <v-file-input v-model="file" hint="فایل های مجاز : تصویر - ویدئو - متن - صوت" color="blue" clearable label="انتخاب فایل" variant="outlined" density="comfortable" ></v-file-input>
      <validation_errors :errors="Validation_Errors(errors,'file')"></validation_errors>
    </div>
    <div class="mb-3">
      <date-picker  :error="Validation_Check(errors,'file')" compact-time auto-submit color="#5c6bc0"  type="datetime" label="انتخاب تاریخ و زمان" v-model="date" format="YYYY-MM-DD HH:mm" display-format="jYYYY-jMM-jDD HH:mm" />
      <validation_errors :errors="Validation_Errors(errors,'date')"></validation_errors>
    </div>
    <div class="mt-6 mb-2 text-end" @keyup.enter="Create_Report">
      <v-btn :loading="loading" color="success" append-icon="mdi-check" text="ثبت گزارش" flat  rounded @click="Create_Report"></v-btn>
    </div>

  </div>
</template>

<style scoped>

</style>