<script>

import {Stores_Customer} from "@/stores/customers/customers.js";
import {Stores_Statuses} from "@/stores/customers/statuses.js";

export default {
  name: "Action_Customer_Report_Create",
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
      errors:[],
      selected_messages: {},
      available_messages: [],
      messageValidationErrors: {},
      add_reminder: false,
      reminder_title: null,
      reminder_description: null,
      reminder_date: null,
      reminder_time: null,
      reminders_upcoming: null
    }
  },
  computed: {
    formattedDate() {
      if (!this.date) return '';
      return moment(this.date).format('jYYYY-jMM-jDD HH:mm');
    },
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
    status_id(newVal) {
      this.updateAvailableMessages();
    }
  },
  methods:{
    Create_Report(){
      this.loading=true;
      
      // Validate required message fields
      this.messageValidationErrors = {};
      let hasValidationErrors = false;
      
      if (this.available_messages.length > 0) {
        this.available_messages.forEach(message => {
          if (!this.selected_messages[message.id]) {
            this.messageValidationErrors[message.id] = true;
            hasValidationErrors = true;
          }
        });
      }
      
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
      
      if (hasValidationErrors) {
        this.loading = false;
        return this.Notify_Error('لطفاً تمام فیلدهای الزامی را تکمیل کنید');
      }
      
      // Report text validation removed - now optional
      
      let params = {
        customer_id : this.customer.project_customer_id,
        date : this.date,
        status_id : this.status_id,
        project_level_id : this.project_level_id,
        report : this.report,
        file : this.file,
        messages : this.selected_messages,
      }
      
      // Add reminder data if enabled
      if (this.add_reminder) {
        params.reminder_title = this.reminder_title;
        params.reminder_description = this.reminder_description;
        params.reminder_date = this.reminder_date;
        params.reminder_time = this.reminder_time;
        
        // Only add reminders_upcoming if it has a value
        if (this.reminders_upcoming !== null && this.reminders_upcoming !== undefined) {
          params.reminders_upcoming = this.reminders_upcoming;
        }
      }
      
      Stores_Customer().Reports_Store(params).then(res=>{
        this.loading=false;
        this.$emit('Created',res.data.result);
        // Close modal after successful creation
        if (this.onCancel) {
          this.onCancel();
        }
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
      if (!this.customer.project || !this.customer.project.id) {
        console.error('Project ID not available for statuses request');
        return;
      }
      
      Stores_Statuses().All({"project_id": this.customer.project.id}).then(res =>{
        this.statuses = res.data.result;
      }).catch(error =>{
        console.error('Error fetching statuses:', error);
      })
    },
    Get_Levels(){
      let params = {
        id : this.customer.customer.id,
        project_id: this.customer.project.id,
      }
      Stores_Customer().Projects_Levels(params).then(res =>{
        if (res.data.result){
          // Sort levels by priority (ascending order - lower priority number first)
          this.levels = res.data.result.sort((a, b) => (a.priority || 0) - (b.priority || 0));
        }
      }).catch(error =>{
        return this.Notify_Error('خطا در دریافت مراحل')

      })
    },

    updateAvailableMessages() {
      this.available_messages = [];
      this.selected_messages = {};
      
      if (!this.status_id || !this.statuses.length) {
        return;
      }
      
      const selectedStatus = this.statuses.find(status => status.id === this.status_id);
      if (selectedStatus && selectedStatus.messages && selectedStatus.messages.length > 0) {
        this.available_messages = selectedStatus.messages;
      }
    },

    onMessageOptionChange(messageId, optionId) {
      if (optionId) {
        this.selected_messages[messageId] = optionId;
        // Clear validation error when user selects an option
        if (this.messageValidationErrors[messageId]) {
          delete this.messageValidationErrors[messageId];
        }
      } else {
        delete this.selected_messages[messageId];
      }
    },

    setReminderOffset(minutes) {
      this.reminders_upcoming = minutes;
    }

  }

}
</script>

<template>
  <div class="mt-0">

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

    <!-- Failure Reasons Section -->
    <div v-if="available_messages.length > 0" class="mb-3">
      <div class="text-error mb-4">موارد زیر را تکمیل کنید</div>
      <div v-for="message in available_messages" :key="message.id" class="mb-3">
        <v-select
          :items="message.options"
          :item-title="'option'"
          :item-value="'id'"
          v-model="selected_messages[message.id]"
          @update:model-value="onMessageOptionChange(message.id, $event)"
          color="blue"
          variant="outlined"
          density="comfortable"
          :label="`انتخاب ${message.name}`"
          rounded="lg"
          class="custom-select"
          clearable
          :error="messageValidationErrors[message.id]"
          :error-messages="messageValidationErrors[message.id] ? ['این فیلد الزامی است'] : []"
        >
        </v-select>
      </div>
    </div>
    <div class="mb-3">
      <v-file-input v-model="file" hint="فایل های مجاز : تصویر - ویدئو - متن - صوت" color="blue" clearable label="انتخاب فایل" variant="outlined" density="comfortable" rounded="lg" class="custom-file-input"></v-file-input>
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
            v-for="time in quickTimeOptions"
            :key="time.minutes"
            :variant="reminders_upcoming === time.minutes ? 'flat' : 'outlined'"
            :color="reminders_upcoming === time.minutes ? 'blue' : 'grey'"
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

.custom-textfield :deep(.v-field__outline) {
  border-radius: 12px !important;
}

/* Custom reminder date input styling to match Vuetify */
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

</style>