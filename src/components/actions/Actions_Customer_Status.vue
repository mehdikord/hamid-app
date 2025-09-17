<script>
import {Stores_Statuses} from "@/stores/customers/statuses.js";
import {Stores_Customer} from "@/stores/customers/customers.js";

export default {
name: "Actions_Customer_Status",
  emits: ['changed'],
  props:{
    customer:Object,
    show_level:false,
    required:true
  },
  mounted(){
  if(this.customer.status){
    this.status_id = this.customer.status.id;
  }
  if (this.customer.level){
    this.project_level_id = this.customer.level.id;
  }
  },
  data(){
    return {
      change_dialog : false,
      change_loading: false,
      status_id:null,
      project_level_id:null,
      description:null,
      statuses : [],
      levels : [],
      statuses_loading: false,
      levels_loading: false,
  }
  },
  methods:{
    Open_Dialog(){
      this.Get_Statuses();
      this.Get_Levels();
      this.change_dialog = true;
    },
    Get_Statuses(){
      this.statuses_loading = true;
      Stores_Statuses().All().then(res =>{
        this.statuses_loading = false;
        if(res.data.result.length){
          this.statuses = res.data.result;
        }
      }).catch(error =>{
        this.statuses_loading = false;
      })
    },
    Get_Levels(){
      this.levels_loading = true;
      let params = {
        id : this.customer.customer.id,
        project_id: this.customer.project.id,
      }
      Stores_Customer().Projects_Levels(params).then(res =>{
        this.levels_loading = false;
        if (res.data.result.length){
          this.levels = res.data.result;
        }
      }).catch(error =>{
        this.levels_loading = false;
        return this.Notify_Error('خطا در دریافت مراحل')
      })
    },
    Change_Status(){
      if (!this.status_id){
        return this.Notify_Error('وضعیت مورد نظر را انتخاب کنید')

      }
      this.change_loading = true;
      let params = {
        customer_id : this.customer.project_customer_id,
        status_id : this.status_id,
        project_level_id : this.project_level_id,
        description : this.description,
      }
      Stores_Customer().Statuses_Store(params).then(res =>{
        this.change_loading = false;
        this.change_dialog = false;
        this.status_id=null;
        this.description=null
        this.Notify_Success('وضعیت مشتری باموفقیت تغییر کرد')
        this.$emit('changed',res.data.result);
      }).catch(error =>{
        this.change_loading = false;
        this.Notify_Error_Server();
      })


    }

  }
}
</script>

<template>

  <template v-if="customer">
    <template v-if="show_level">
      <v-btn v-if="!customer.level" @click="Open_Dialog" variant="flat" color="grey-darken-3" size="small" class="font-13 mt-2" rounded>بدون مرحله</v-btn>
      <v-btn v-else @click="Open_Dialog" variant="flat" color="orange-darken-1" size="small" class="font-13 mt-2" rounded>{{ customer.level.name }}</v-btn>

    </template>
    <template v-else>
      <v-btn v-if="!customer.status" @click="Open_Dialog" variant="flat" color="grey-darken-3" size="small" class="font-13 mt-2" rounded>بدون وضعیت</v-btn>
    <v-btn v-else @click="Open_Dialog" variant="flat" :style="{'backgroundColor' : customer.status.color,'color' : 'white' }" size="small" class="font-13 mt-2" rounded>{{ customer.status.name }}</v-btn>

    </template>


    <v-dialog
        v-model="change_dialog"
        :max-width="$vuetify.display.mdAndUp ? '600' : '95'"
        :fullscreen="$vuetify.display.smAndDown"
        transition="dialog-bottom-transition"
    >
      <v-card 
        variant="flat" 
        rounded="lg"
        :class="$vuetify.display.smAndDown ? 'h-100' : ''"
        elevation="8"
      >
        <!-- Enhanced Header -->
        <v-card-item class="pa-4 pa-sm-6">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon
                icon="mdi-flag-variant"
                color="indigo-darken-2"
                size="28"
                class="me-3"
              ></v-icon>
              <div>
                <h3 class="text-h5 font-weight-bold text-primary-darken-2 mb-0">
                  تغییر وضعیت مشتری در پروژه
                </h3>
                <p class="text-grey-darken-1 mb-0 mt-1">
                  تغییر وضعیت و مرحله مذاکره برای مشتری {{ customer.customer.name || customer.customer.phone }}
                </p>
              </div>
            </div>
          </div>
        </v-card-item>
        
        <v-divider class="mx-4 mx-sm-6"></v-divider>
        
        <!-- Content Area -->
        <v-card-item class="pa-4 pa-sm-6 pt-0">
          <v-row>
            <v-col>
              <div>
                <v-icon icon="mdi-cellphone font-29" color="indigo"></v-icon>
                <span class="text-grey-darken-3 font-12">شماره موبایل : </span>
                <strong>{{ customer.customer.phone}}</strong>
              </div>
            </v-col>
            <v-col>
              <div>
                <v-icon icon="mdi-account font-29" color="indigo"></v-icon>
                <span class="text-grey-darken-3 font-12"> نام مشتری : </span>
                <strong>{{ customer.customer.name ?? '---'}}</strong>
              </div>
            </v-col>
          </v-row>
          <div class="mt-6">
            <label>انتخاب مرحله مذاکره</label>
            <div v-if="levels_loading" class="mt-3">
              <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
            </div>
            <v-select
                v-else
                class="mt-3 custom-select"
                :items="levels"
                v-model="project_level_id"
                item-title="name"
                item-value="id"
                rounded="lg"
                color="blue"
                variant="outlined"
                density="comfortable"
            >
            </v-select>
          </div>
          <div>
            <label>انتخاب وضعیت جدید</label>
            <div v-if="statuses_loading" class="mt-3">
              <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
            </div>
            <v-select
                v-else
                class="mt-3 custom-select"
                :items="statuses"
                v-model="status_id"
                item-title="name"
                item-value="id"
                rounded="lg"
                color="blue"
                variant="outlined"
                density="comfortable"
            >

            </v-select>
          </div>
          <div>
            <label>توضیحات (اختیاری)</label>
             <v-textarea
             rounded="lg"
             variant="outlined"
             density="comfortable"
             color="blue"
             rows="3"
             v-model="description"
             class="custom-input mt-3"
             >

             </v-textarea>
          </div>
        </v-card-item>
        <!-- Footer Actions with Both Buttons -->
        <div class="pa-4 pa-sm-6 pt-0">
          <v-row no-gutters class="button-row">
            <v-col cols="12" md="6" class="pr-md-2 mb-3 mb-md-0">
              <v-btn 
                :loading="change_loading" 
                color="success" 
                prepend-icon="mdi-check" 
                variant="flat"  
                rounded="lg" 
                block
                size="large"
                @click="Change_Status"
                class="action-button"
              >
                تغییر وضعیت و ثبت اطلاعات
              </v-btn>
            </v-col>
            <v-col cols="12" md="6" class="pl-md-2">
              <v-btn
                @click="change_dialog=false"
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
      </v-card>
    </v-dialog>

  </template>



</template>

<style scoped>
/* Enhanced Modal Styles for Mobile */
@media (max-width: 960px) {
  .v-dialog .v-card {
    border-radius: 16px 16px 0 0 !important;
  }
  
  .v-dialog .v-card-item {
    padding: 16px !important;
  }
  
  .v-dialog .v-card-actions {
    padding: 16px !important;
  }
}

/* Smooth transitions for mobile */
.v-dialog .v-card {
  transition: all 0.3s ease-in-out;
}

/* Font consistency */
.v-dialog .v-card-item h3.text-h5 {
  font-family: inherit !important;
  font-weight: 700 !important;
  color: rgb(var(--v-theme-primary-darken-2)) !important;
  font-size: 1.5rem !important;
  line-height: 1.2 !important;
}

/* Better spacing for mobile headers */
@media (max-width: 600px) {
  .v-dialog .v-card-item h3 {
    font-size: 1.25rem !important;
    line-height: 1.4 !important;
    font-family: inherit !important;
  }
  
  .v-dialog .v-card-item p {
    font-size: 0.875rem !important;
  }
}

/* Custom input and select styling */
.custom-input :deep(.v-field) {
  border-radius: 12px !important;
}

.custom-input :deep(.v-field__outline) {
  border-radius: 12px !important;
}

.custom-select :deep(.v-field) {
  border-radius: 12px !important;
}

.custom-select :deep(.v-field__outline) {
  border-radius: 12px !important;
}

/* Button styling */
.v-btn.rounded-lg {
  border-radius: 12px !important;
}

/* Skeleton loader styling */
.v-skeleton-loader {
  border-radius: 8px !important;
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