<script>

import {Stores_Customer} from "@/stores/customers/customers.js";

export default {
  name: "Action_Customer_Reminder_Create",
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
    // No initialization needed for reminders
  },
  data(){
    return {
      loading:false,
      errors:[],
      reminder_title: null,
      reminder_description: null,
      reminder_date: null,
      reminder_time: null,
      reminder_minutes_before: null
    }
  },
  computed: {
    formattedReminderDate() {
      if (!this.reminder_date) return '';
      return moment(this.reminder_date).format('jYYYY-jMM-jDD');
    },
    quickTimeOptions() {
      return [
        { minutes: 15, label: '15 دقیقه قبل' },
        { minutes: 30, label: '30 دقیقه قبل' },
        { minutes: 45, label: '45 دقیقه قبل' },
        { minutes: 60, label: '1 ساعت قبل' }
      ];
    }
  },
  watch: {
    // No watchers needed for reminders
  },
  methods:{

    Create_Reminder(){
      this.loading=true;
      
      // Validate required fields
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
      
      let params = {
        customer_id : this.customer.id,
        reminder_title : this.reminder_title,
        reminder_description : this.reminder_description,
        reminder_date : this.reminder_date,
        reminder_time : this.reminder_time,
        reminder_minutes_before : this.reminder_minutes_before,
        is_reminder_only: true // Flag to indicate this is a reminder-only creation
      }
      
      // Remove null/undefined values to avoid sending them
      Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
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

    setReminderOffset(minutes) {
      this.reminder_minutes_before = minutes;
    }

  }

}
</script>

<template>
  <div class="mt-0">



    <!-- Reminder Section -->
    <div class="reminder-section mb-3">
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

      <!-- Reminder Minutes Before -->
      <div class="mb-3">
        <div class="quick-time-label mb-2">یادآوری چند دقیقه قبل:</div>
        <div class="quick-time-buttons">
          <v-btn
            v-for="time in quickTimeOptions"
            :key="time.minutes"
            :variant="reminder_minutes_before === time.minutes ? 'flat' : 'outlined'"
            :color="reminder_minutes_before === time.minutes ? 'blue' : 'grey'"
            size="small"
            rounded="lg"
            class="quick-time-btn"
            @click="setReminderOffset(time.minutes)"
          >
            {{ time.label }}
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Footer Actions with Both Buttons -->
    <div class="mt-8 mb-4">
      <v-row class="button-row" :gutter="16">
        <v-col cols="12" md="6" class="mb-3 mb-md-0">
          <v-btn 
            :loading="loading" 
            color="purple-darken-2" 
            prepend-icon="mdi-bell" 
            variant="flat"  
            rounded="lg" 
            block
            size="large"
            @click="Create_Reminder"
            class="action-button"
          >
            ثبت یادآور
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
}

/* Custom Select Styling */
.custom-select {
  font-family: inherit !important;
}

.custom-select .v-field {
  border-radius: 12px !important;
  border: 1px solid #e0e0e0 !important;
  transition: all 0.3s ease !important;
}

.custom-select .v-field:hover {
  border-color: #2196f3 !important;
}

.custom-select .v-field--focused {
  border-color: #2196f3 !important;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1) !important;
}

/* Custom Textarea Styling */
.custom-textarea {
  font-family: inherit !important;
}

.custom-textarea .v-field {
  border-radius: 12px !important;
  border: 1px solid #e0e0e0 !important;
  transition: all 0.3s ease !important;
}

.custom-textarea .v-field:hover {
  border-color: #2196f3 !important;
}

.custom-textarea .v-field--focused {
  border-color: #2196f3 !important;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1) !important;
}

/* Custom Textfield Styling */
.custom-textfield {
  font-family: inherit !important;
}

.custom-textfield .v-field {
  border-radius: 12px !important;
  border: 1px solid #e0e0e0 !important;
  transition: all 0.3s ease !important;
}

.custom-textfield .v-field:hover {
  border-color: #2196f3 !important;
}

.custom-textfield .v-field--focused {
  border-color: #2196f3 !important;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1) !important;
}

/* Custom File Input Styling */
.custom-file-input {
  font-family: inherit !important;
}

.custom-file-input .v-field {
  border-radius: 12px !important;
  border: 1px solid #e0e0e0 !important;
  transition: all 0.3s ease !important;
}

.custom-file-input .v-field:hover {
  border-color: #2196f3 !important;
}

.custom-file-input .v-field--focused {
  border-color: #2196f3 !important;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1) !important;
}

/* Custom Checkbox Styling */
.custom-checkbox {
  font-family: inherit !important;
}

.custom-checkbox .v-selection-control {
  margin: 0 !important;
}

/* Reminder Section Styling */
.reminder-section {
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  margin-top: 16px;
  background: #fafafa;
}

/* Custom Reminder Date Input Styling */
.custom-reminder-date-input-wrapper {
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.custom-reminder-date-input-wrapper:hover {
  border-color: #2196f3;
}

.custom-reminder-date-input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 16px;
  color: #1a1a1a;
  font-family: inherit;
}

.custom-reminder-date-label {
  position: absolute;
  top: -8px;
  right: 12px;
  background: white;
  padding: 0 8px;
  font-size: 12px;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.custom-reminder-date-icon {
  position: absolute;
  left: 16px;
  color: #666;
  font-size: 20px;
}

/* Custom Time Picker Styling */
.custom-time-picker {
  font-family: inherit !important;
}

.custom-time-picker .v-field {
  border-radius: 12px !important;
  border: 1px solid #e0e0e0 !important;
  transition: all 0.3s ease !important;
}

.custom-time-picker .v-field:hover {
  border-color: #2196f3 !important;
}

.custom-time-picker .v-field--focused {
  border-color: #2196f3 !important;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1) !important;
}

/* Action Button Styling */
.action-button {
  font-family: inherit !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.5px !important;
  height: 48px !important;
}

.action-button:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
}

/* Button Row Spacing */
.button-row {
  margin-top: 24px;
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
  min-width: 60px !important;
  height: 36px !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
}

.quick-time-btn :deep(.v-btn__content) {
  font-size: 12px !important;
  font-weight: 500 !important;
}

/* Mobile Responsive */
@media (max-width: 960px) {
  .reminder-section {
    padding: 16px;
    margin-top: 12px;
  }
  
  .custom-reminder-date-input-wrapper {
    height: 48px;
    padding: 0 12px;
  }
  
  .custom-reminder-date-input {
    font-size: 14px;
  }
  
  .custom-reminder-date-label {
    font-size: 11px;
    right: 8px;
  }
  
  .custom-reminder-date-icon {
    left: 12px;
    font-size: 18px;
  }
  
  .action-button {
    height: 44px !important;
    font-size: 14px !important;
  }
}

@media (max-width: 600px) {
  .reminder-section {
    padding: 12px;
    margin-top: 8px;
  }
  
  .custom-reminder-date-input-wrapper {
    height: 44px;
    padding: 0 10px;
  }
  
  .custom-reminder-date-input {
    font-size: 13px;
  }
  
  .custom-reminder-date-label {
    font-size: 10px;
    right: 6px;
  }
  
  .custom-reminder-date-icon {
    left: 10px;
    font-size: 16px;
  }
  
  .action-button {
    height: 40px !important;
    font-size: 13px !important;
  }
}
</style>
