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
      errors:[],
      // Reminder fields
      add_reminder: false,
      reminder_title: '',
      reminder_description: '',
      reminder_date: null,
      reminder_time: null,
      reminder_offset: 15
    }
  },
  computed: {
    formattedReminderDate() {
      if (!this.reminder_date) return '';
      return moment(this.reminder_date).format('jYYYY-jMM-jDD');
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
      
      // Validate reminder fields if reminder is enabled
      if (this.add_reminder) {
        if (!this.reminder_title) {
          this.loading = false;
          return this.Notify_Error('عنوان یادآور الزامی است');
        }
        if (!this.reminder_date) {
          this.loading = false;
          return this.Notify_Error('تاریخ یادآور الزامی است');
        }
        if (!this.reminder_time) {
          this.loading = false;
          return this.Notify_Error('زمان یادآور الزامی است');
        }
      }
      
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
      
      // Add reminder data if enabled
      if (this.add_reminder) {
        params.reminder = {
          title: this.reminder_title,
          description: this.reminder_description,
          date: this.reminder_date,
          time: this.reminder_time,
          offset: this.reminder_offset
        };
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

    <!-- Add Reminder Checkbox -->
    <div class="mb-3">
      <v-checkbox
        v-model="add_reminder"
        color="blue"
        label="افزودن یاداور جدید"
        hide-details
        class="custom-checkbox"
      ></v-checkbox>
    </div>

    <!-- Reminder Section -->
    <div v-if="add_reminder" class="reminder-section mb-3">
      <!-- Reminder Title -->
      <div class="mb-3">
        <v-text-field
          v-model="reminder_title"
          label="عنوان یادآور"
          color="blue"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          class="custom-textfield"
        ></v-text-field>
      </div>

      <!-- Reminder Description -->
      <div class="mb-3">
        <v-textarea
          v-model="reminder_description"
          label="توضیحات یادآور"
          color="blue"
          variant="outlined"
          rows="2"
          rounded="lg"
          class="custom-textarea"
        ></v-textarea>
      </div>

      <!-- Reminder Date -->
      <div class="mb-3">
        <div class="custom-reminder-date-input-wrapper">
          <input
            type="text"
            class="custom-reminder-date-input"
            :value="formattedReminderDate"
            placeholder="انتخاب تاریخ یادآور"
            readonly
          />
          <label class="custom-reminder-date-label">انتخاب تاریخ یادآور</label>
          <i class="mdi mdi-calendar custom-reminder-date-icon"></i>
        </div>
        
        <date-picker  
          compact-time 
          auto-submit 
          color="#5c6bc0"  
          type="date" 
          v-model="reminder_date" 
          format="YYYY-MM-DD" 
          display-format="jYYYY-jMM-jDD"
          custom-input=".custom-reminder-date-input"
        />
      </div>

      <!-- Reminder Time -->
      <div class="mb-3">
        <date-picker
          v-model="reminder_time"
          type="time"
          :jump-minute="15"
          :round-minute="true"
          color="#5c6bc0"
          format="HH:mm"
          display-format="HH:mm"
          placeholder="انتخاب زمان یادآور"
          class="custom-time-picker"
        />
      </div>

      <!-- Reminder Offset Selection -->
      <div class="mb-3">
        <div class="quick-time-label mb-2">یادآوری چند دقیقه قبل:</div>
        <div class="quick-time-buttons">
          <v-btn
            v-for="offset in [5, 15, 30, 60]"
            :key="offset"
            :variant="reminder_offset === offset ? 'flat' : 'outlined'"
            :color="reminder_offset === offset ? 'blue' : 'grey'"
            size="small"
            rounded="lg"
            @click="reminder_offset = offset"
            class="quick-time-btn"
          >
            {{ offset }} دقیقه
          </v-btn>
        </div>
      </div>
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

/* Reminder section styling */
.reminder-section {
  background-color: rgba(var(--v-theme-primary), 0.05);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

.custom-checkbox :deep(.v-selection-control) {
  margin-bottom: 0;
}

.custom-textfield :deep(.v-field) {
  border-radius: 12px !important;
}

.custom-textarea :deep(.v-field) {
  border-radius: 12px !important;
}

.custom-reminder-date-input-wrapper {
  position: relative;
  margin-bottom: 8px;
}

.custom-reminder-date-input {
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

.custom-reminder-date-input:focus {
  outline: none;
  border-color: rgb(var(--v-theme-primary));
  border-width: 2px;
}

.custom-reminder-date-input:hover {
  border-color: rgba(var(--v-theme-on-surface), 0.6);
}

.custom-reminder-date-label {
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

.custom-reminder-date-icon {
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

.custom-reminder-date-input-wrapper:hover .custom-reminder-date-icon {
  opacity: 1;
  color: rgb(var(--v-theme-error));
}

.custom-reminder-date-input:focus + .custom-reminder-date-label + .custom-reminder-date-icon {
  opacity: 1;
  color: rgb(var(--v-theme-error));
}

.custom-time-picker {
  width: 100%;
}

.custom-time-picker :deep(.mx-input-wrapper) {
  border-radius: 12px !important;
}

.custom-time-picker :deep(.mx-input) {
  border-radius: 12px !important;
  height: 56px !important;
  padding: 16px 12px !important;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
  font-size: 16px !important;
  background-color: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
}

/* Quick time buttons styling */
.quick-time-label {
  font-size: 14px;
  font-weight: 500;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 8px;
}

.quick-time-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-time-btn {
  min-width: 80px !important;
  font-size: 12px !important;
}

</style>