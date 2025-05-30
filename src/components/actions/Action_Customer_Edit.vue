<script>

import {Stores_Customer} from "@/stores/customers/customers.js";

export default {
  name: "Action_Customer_Edit",
  props: {
    customer: {
      type: Object,
      required: true
    }
  },
  mounted() {
    if (this.customer){
      this.Get_Projects();
    }
  },
  data(){
    return {
      item : this.customer,
      project_id : null,
      projects : [],
      fields : [],
      final_fields:[],
      errors : [],
      loading : false,
    }
  },
  methods:{
    Edit_Customer(){
      this.loading = true;
      const output = {};
      for (let key in this.final_fields) {
        if (this.final_fields[key] !== null) {
          output[key] = this.final_fields[key];
        }
      }

      this.item.fields = output;
      this.item.project_id = this.project_id;

      Stores_Customer().Edit(this.item).then(res=>{
        this.loading = false;
        this.$emit('Updated',res.data.result);
      }).catch(error=>{
        if (error.response.status === 422) {
          this.errors=error.response.data;
          this.Notify_Error_Validation()
        }else {
          this.Notify_Error_Server()
        }
        this.loading=false;
      })


    },
    Get_Projects(){
      Stores_Customer().Projects_Index({id : this.customer.id}).then(res => {
        this.projects = res.data.result;
        if (this.projects){
          this.project_id  = this.projects[0].id;
          this.fields = this.projects[0].fields;
          if (this.fields.length > 0){
            this.fields.forEach(field => {
              this.final_fields[field.id] = null;
            })
          }
          Stores_Customer().Projects_Fields({id : this.customer.id,project_id:this.project_id}).then(res=>{
            if (res.data.result){
              res.data.result.forEach(item => {
                this.final_fields[item.field_id] = item.val;
              })
            }

          })

        }
      })
    }
  }
}
</script>

<template>
  <template v-if="customer">
    <div class="mt-3" @keyup.enter="Edit_Customer">
      <v-row>
        <v-col md="6" cols="12" class="pb-0">
          <v-text-field :error="Validation_Check(errors,'name')" v-model="item.name" append-inner-icon="mdi-account" rounded variant="outlined" type="text" label="نام کامل" />
          <validation_errors :errors="Validation_Errors(errors,'name')"></validation_errors>
        </v-col>
        <v-col md="6" cols="12" class="pb-0">
          <v-text-field :error="Validation_Check(errors,'instagram_id')" v-model="item.instagram_id" append-inner-icon="mdi-instagram" rounded variant="outlined" type="text" label="اینستاگرام" />
          <validation_errors :errors="Validation_Errors(errors,'instagram_id')"></validation_errors>
        </v-col>
        <v-col md="6" cols="12">
          <v-text-field :error="Validation_Check(errors,'email')" v-model="item.email" append-inner-icon="mdi-email" rounded variant="outlined" type="email" label="ایمیل" />
          <validation_errors :errors="Validation_Errors(errors,'email')"></validation_errors>
        </v-col>
        <v-col md="6" cols="12">
          <v-text-field :error="Validation_Check(errors,'national_code')" v-model="item.national_code" append-inner-icon="mdi-card-account-details" rounded variant="outlined" type="number" label="کد ملی" />
          <validation_errors :errors="Validation_Errors(errors,'national_code')"></validation_errors>
        </v-col>
        <v-col md="6" cols="12">
          <v-text-field :error="Validation_Check(errors,'tel')" v-model="item.tel" append-inner-icon="mdi-phone" rounded variant="outlined" type="number" label="تلفن ثابت" />
          <validation_errors :errors="Validation_Errors(errors,'tel')"></validation_errors>
        </v-col>
        <v-col md="6" cols="12">
          <v-text-field :error="Validation_Check(errors,'postal_code')" v-model="item.postal_code" append-inner-icon="mdi-mailbox" rounded variant="outlined" type="number" label="کد پستی" />
          <validation_errors :errors="Validation_Errors(errors,'postal_code')"></validation_errors>
        </v-col>

        <v-col cols="12" >
          <strong class="text-blue-darken-2">اطلاعات مشتری در پروژه </strong>
          <div class="mt-2">
          </div>
        </v-col>
        <template v-if="fields.length">
          <v-col v-for="field in fields" md="6" cols="12">
            <v-text-field v-model="final_fields[field.id]"  rounded variant="outlined" type="text" :label="field.title" />
          </v-col>
        </template>

      </v-row>
      <div class="mt-4 mb-4 text-end">
        <v-btn @click="Edit_Customer" :loading="loading" color="success" text="ثبت اطلاعات مشتری" class="font-14" append-icon="mdi-check" flat rounded></v-btn>
      </div>
    </div>
  </template>
</template>

<style scoped>

</style>