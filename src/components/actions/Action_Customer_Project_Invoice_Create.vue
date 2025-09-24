<script>

import {Stores_Customer} from "@/stores/customers/customers.js";
import {de} from "vuetify/locale";

export default {
  name: "Action_Customer_Project_Invoice_Create",
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
      projects:[],
      project_id:null,
      user_project:null,
      errors:[]

    }
  },
  computed: {
    formattedDate() {
      if (!this.date) return '';
      return moment(this.date).format('jYYYY-jMM-jDD HH:mm');
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
      if (this.user_project && !this.user_project.target_price){
        if (!this.target_price){
          this.loading=false;
          return this.Notify_Error('مبلغ معامله را وارد کنید !');
        }
        try {
          await Stores_Customer().Invoices_Target_Price({customer_id : this.user_project.project_customer_id,price:this.target_price});
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
      if (this.user_project && this.user_project.target_price) {
        const remainingAmount = this.user_project.target_price - this.user_project.sum_invoices;
        if (this.price > remainingAmount) {
          this.loading=false;
          return this.Notify_Error(`مبلغ واریزی نمی‌تواند بیشتر از مبلغ باقیمانده (${this.$filters.number_format(remainingAmount)} تومان) باشد!`);
        }
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
        <v-text-field 
          v-model="formatted_target_price" 
          @input="onTargetPriceInput"
          append-inner-icon="mdi-currency-usd" 
          rounded="lg" 
          variant="outlined" 
          type="text" 
          label="وارد کردن مبلغ معامله ( تومان )" 
          placeholder="1,500,000" 
          class="custom-input" 
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
        rounded="lg" 
        variant="outlined" 
        type="text" 
        :label="user_project && user_project.target_price ? `مبلغ واریزی ( حداکثر ${this.$filters.number_format(user_project.target_price - user_project.sum_invoices)} تومان )` : 'مبلغ واریزی ( تومان )'" 
        class="custom-input" 
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
      rounded="lg"
      :error="Validation_Check(errors,'description')"
      class="custom-textarea"
      >
      </v-textarea>
      <validation_errors :errors="Validation_Errors(errors,'description')"></validation_errors>
    </div>
    <div class="mb-3">
      <v-file-input v-model="file" hint="فایل های مجاز : تصویر - ویدئو - متن - صوت" color="blue" clearable label="انتخاب فایل" variant="outlined" density="comfortable" rounded="lg" class="custom-file-input" ></v-file-input>
      <validation_errors :errors="Validation_Errors(errors,'file')"></validation_errors>
    </div>
    <div class="mb-3">
      <!-- Custom HTML input styled like Vuetify -->
      <div class="custom-date-input-wrapper" :class="{ error: Validation_Check(errors,'date') }">
        <input
          type="text"
          class="custom-date-input"
          :value="formattedDate"
          placeholder="انتخاب تاریخ و زمان"
          readonly
        />
        <label class="custom-date-label">انتخاب تاریخ و زمان</label>
        <i class="mdi mdi-calendar custom-date-icon"></i>
      </div>
      
      <!-- Date picker component -->
      <date-picker  
        :error="Validation_Check(errors,'date')" 
        compact-time 
        auto-submit 
        color="#5c6bc0"  
        type="datetime" 
        v-model="date" 
        format="YYYY-MM-DD HH:mm" 
        display-format="jYYYY-jMM-jDD HH:mm"
        custom-input=".custom-date-input"
      />
      <validation_errors :errors="Validation_Errors(errors,'date')"></validation_errors>
    </div>

    <!-- Footer Actions with Both Buttons -->
    <div class="mt-8 mb-4">
      <v-row class="button-row" :gutter="16">
        <v-col cols="12" md="6" class="mb-3 mb-md-0">
          <v-btn 
            :loading="loading" 
            color="orange-darken-2" 
            prepend-icon="mdi-check" 
            variant="flat"  
            rounded="lg" 
            block
            size="large"
            @click="Create_Invoice"
            class="action-button"
          >
            ثبت فاکتور
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
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

.custom-input :deep(.v-field) {
  border-radius: 12px !important;
}

.custom-input :deep(.v-field__outline) {
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

/* Custom date input styling to match Vuetify */
.custom-date-input-wrapper {
  position: relative;
  margin-bottom: 8px;
}

.custom-date-input {
  width: 100%;
  height: 56px;
  padding: 16px 48px 16px 12px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  background-color: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  transition: all 0.2s ease;
  cursor: pointer;
  box-sizing: border-box;
}

.custom-date-input:focus {
  outline: none;
  border-color: rgb(var(--v-theme-primary));
  border-width: 2px;
}

.custom-date-input:hover {
  border-color: rgba(var(--v-theme-on-surface), 0.6);
}

.custom-date-label {
  position: absolute;
  top: 16px;
  left: 12px;
  font-size: 12px;
  color: rgb(var(--v-theme-primary));
  background-color: rgb(var(--v-theme-surface));
  padding: 0 4px;
  pointer-events: none;
  transition: all 0.2s ease;
}

.custom-date-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 20px;
  pointer-events: none;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.custom-date-input-wrapper:hover .custom-date-icon {
  opacity: 1;
  color: rgb(var(--v-theme-error));
}

.custom-date-input:focus + .custom-date-label + .custom-date-icon {
  opacity: 1;
  color: rgb(var(--v-theme-error));
}

/* Error state styling */
.custom-date-input-wrapper.error .custom-date-input {
  border-color: rgb(var(--v-theme-error));
}

.custom-date-input-wrapper.error .custom-date-label {
  color: rgb(var(--v-theme-error));
}

/* Button spacing and mobile optimization */
.button-row {
  margin: 0 !important;
}

.action-button {
  min-height: 48px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
}

/* Desktop button layout */
@media (min-width: 960px) {
  .button-row .v-col {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
  
  .button-row .v-col:first-child {
    padding-left: 0 !important;
  }
  
  .button-row .v-col:last-child {
    padding-right: 0 !important;
  }
}

/* Mobile-specific spacing */
@media (max-width: 960px) {
  .action-button {
    min-height: 52px !important;
    font-size: 16px !important;
  }
}

</style>
