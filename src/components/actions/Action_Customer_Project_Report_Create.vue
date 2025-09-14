<script>

import {Stores_Customer} from "@/stores/customers/customers.js";
import {Stores_Statuses} from "@/stores/customers/statuses.js";

export default {
  name: "Action_Customer_Project_Report_Create",
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
    this.Get_Project();
    this.Get_Statuses();

  },
  data(){
    return {
      loading:false,
      report:null,
      date:null,
      file:null,
      status_id:null,
      project_level_id:null,
      statuses : [],
      levels : [],
      projects:[],
      project_id:null,
      errors:[]

    }
  },
  methods:{

    Get_Project(){
      Stores_Customer().Projects_Index({id : this.customer.id}).then(res => {
        this.projects = res.data.result;
        if (this.projects){
          this.project_id = this.projects[0].id;
          this.Get_Levels();

        }
      })

    },

    Create_Report(){
      this.loading=true;
      
      // Validate required fields
      if (!this.project_id){
        this.loading=false;
        return this.Notify_Error('پروژه مورد نظر را انتخاب کنید')
      }
      
      if (!this.report || this.report.trim() === ''){
        this.loading=false;
        return this.Notify_Error('متن گزارش را وارد کنید')
      }
      
      let params = {
        customer_id : this.customer.id,
        project_id : this.project_id,
        date : this.date,
        status_id : this.status_id,
        project_level_id : this.project_level_id,
        report : this.report,
        file : this.file,
      }
      Stores_Customer().Projects_Reports_Store(params).then(res=>{
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
        id : this.customer.id,
        project_id: this.project_id
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
  <div class="mt-0">

    <div class="mb-3">
      <v-select
          class="mt-3 custom-select"
          :items="projects"
          v-model="project_id"
          item-title="name"
          item-value="id"
          color="blue"
          variant="outlined"
          density="comfortable"
          label="انتخاب پروژه "
          rounded="lg"
      >

      </v-select>
    </div>

    <div class="mb-3">
      <v-textarea
      variant="outlined"
      rows="3"
      label="متن گزارش"
      v-model="report"
      color="blue"
      :error="Validation_Check(errors,'report')"
      rounded="lg"
      class="custom-textarea"
      >
      </v-textarea>
      <validation_errors :errors="Validation_Errors(errors,'report')"></validation_errors>
    </div>
    <div class="mb-3">
      <v-select
          class="mt-3 custom-select"
          :items="levels"
          v-model="project_level_id"
          item-title="name"
          item-value="id"
          color="blue"
          variant="outlined"
          density="comfortable"
          label="انتخاب مرحله مذاکره"
          rounded="lg"
      >
      </v-select>
    </div>

    <div class="mb-3">
      <v-select
          class="mt-3 custom-select"
          :items="statuses"
          v-model="status_id"
          item-title="name"
          item-value="id"
          color="blue"
          variant="outlined"
          density="comfortable"
          label="انتخاب وضعیت جدید"
          rounded="lg"
      >

      </v-select>
    </div>
    <div class="mb-3">
      <v-file-input v-model="file" hint="فایل های مجاز : تصویر - ویدئو - متن - صوت" color="blue" clearable label="انتخاب فایل" variant="outlined" density="comfortable" rounded="lg" class="custom-file-input"></v-file-input>
      <validation_errors :errors="Validation_Errors(errors,'file')"></validation_errors>
    </div>
    <div class="mb-3">
      <date-picker  
        :error="Validation_Check(errors,'date')" 
        compact-time 
        auto-submit 
        color="#5c6bc0"  
        type="datetime" 
        label="انتخاب تاریخ و زمان" 
        v-model="date" 
        format="YYYY-MM-DD HH:mm" 
        display-format="jYYYY-jMM-jDD HH:mm"
        class="enhanced-date-picker"
      />
      <validation_errors :errors="Validation_Errors(errors,'date')"></validation_errors>
    </div>

    <!-- Footer Actions with Both Buttons -->
    <div class="mt-8 mb-4">
      <v-row no-gutters class="button-row">
        <v-col cols="12" md="6" class="pr-md-2 mb-3 mb-md-0">
          <v-btn 
            :loading="loading" 
            color="teal-darken-2" 
            prepend-icon="mdi-check" 
            variant="flat"  
            rounded="lg" 
            block
            size="large"
            @click="Create_Report"
            class="action-button"
          >
            ثبت گزارش
          </v-btn>
        </v-col>
        <v-col cols="12" md="6" class="pl-md-2">
          <v-btn
            @click="onCancel && onCancel()"
            variant="outlined"
            color="grey-darken-1"
            block
            size="large"
            prepend-icon="mdi-close"
            rounded="lg"
            class="action-button"
          >
            انصراف
          </v-btn>
        </v-col>
      </v-row>
    </div>

  </div>
</template>

<style scoped>
/* Title styling */
.text-h5 {
  font-family: inherit !important;
  font-weight: 700 !important;
  color: rgb(var(--v-theme-primary-darken-2)) !important;
}

/* Ensure proper spacing */
.mt-0 {
  margin-top: 0 !important;
}

.mb-6 {
  margin-bottom: 24px !important;
}

/* Enhanced input styling */
.custom-select :deep(.v-field) {
  border-radius: 12px !important;
}

.custom-select :deep(.v-field__outline) {
  border-radius: 12px !important;
}

.custom-textarea :deep(.v-field) {
  border-radius: 12px !important;
}

.custom-textarea :deep(.v-field__outline) {
  border-radius: 12px !important;
}

.custom-file-input :deep(.v-field) {
  border-radius: 12px !important;
}

.custom-file-input :deep(.v-field__outline) {
  border-radius: 12px !important;
}

/* Enhanced date picker styling */
.enhanced-date-picker {
  border-radius: 12px !important;
}

.enhanced-date-picker :deep(.v-field) {
  border-radius: 12px !important;
}

.enhanced-date-picker :deep(.v-field__outline) {
  border-radius: 12px !important;
}

/* Button spacing and mobile optimization */

.action-button {
  min-height: 48px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
}

/* Mobile-specific spacing */
@media (max-width: 960px) {
  .action-button {
    min-height: 52px !important;
    font-size: 16px !important;
  }
}

</style>