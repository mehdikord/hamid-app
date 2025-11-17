<script>

import {Stores_Customer} from "@/stores/customers/customers.js";
import {Stores_Locations} from "@/stores/Public/locations.js";

export default {
  name: "Action_Customer_Edit",
  props: {
    customer: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.Initialize_Component();
  },
  watch: {
    customer: {
      handler(newCustomer) {
        if (newCustomer) {
          this.Initialize_Component();
        }
      },
      immediate: false,
      deep: true
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
      cities : [],
      provinces:[],
      loading : false,
    }
  },
  methods:{
    Initialize_Component() {
      if (this.customer){
        // Reset fields and final_fields when customer changes
        this.fields = [];
        this.final_fields = {};
        this.project_id = null;
        
        // Extract province_id and city_id from relationship objects
        if (this.customer.province) {
          this.item.province_id = this.customer.province.id;
        }
        if (this.customer.city) {
          this.item.city_id = this.customer.city.id;
        }
        this.item = { ...this.customer };
        this.Get_Projects();
      }
      this.Get_Provinces();
    },
    Get_Formatted_Date(fieldId) {
      const dateValue = this.final_fields[fieldId];
      if (!dateValue) return '';
      return moment(dateValue).format('jYYYY-jMM-jDD');
    },
    Get_Date_Input_Selector(fieldId) {
      return `.custom-date-input-${fieldId}`;
    },
    Edit_Customer(){
      this.loading = true;
      const output = {};
      for (let key in this.final_fields) {
        const value = this.final_fields[key];
        // Find the field to check its type
        const field = this.fields.find(f => f.id == key);
        
        if (field && field.type === 'checkbox') {
          // Convert checkbox boolean to 1/0
          output[key] = value ? 1 : 0;
        } else if (value !== null && value !== undefined && value !== '') {
          output[key] = value;
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
          // Sort projects by updated_at in descending order and select the most recent one
          const sortedProjects = this.projects.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
          this.project_id  = sortedProjects[0].id;
          this.Load_Project_Fields();
        }
      })
    },
    Load_Project_Fields(){
      if (!this.project_id) return;
      
      // Find the selected project
      const selectedProject = this.projects.find(p => p.id === this.project_id);
      if (selectedProject && selectedProject.fields) {
        this.fields = selectedProject.fields;
        // Initialize final_fields for all fields
        this.fields.forEach(field => {
          // Set default value based on field type
          if (field.type === 'checkbox') {
            this.final_fields[field.id] = false;
          } else if (field.type === 'select') {
            this.final_fields[field.id] = null;
          } else if (field.type === 'date') {
            this.final_fields[field.id] = null;
          } else if (field.type === 'number') {
            this.final_fields[field.id] = field.default || null;
          } else {
            this.final_fields[field.id] = field.default || null;
          }
        });
        
        // Load existing field values
        Stores_Customer().Projects_Fields({id : this.customer.id, project_id: this.project_id}).then(res=>{
          if (res.data.result){
            res.data.result.forEach(item => {
              // Handle different types when loading existing values
              const field = this.fields.find(f => f.id === item.field_id);
              if (field) {
                if (field.type === 'checkbox') {
                  this.final_fields[item.field_id] = item.val === '1' || item.val === 1 || item.val === true;
                } else if (field.type === 'select') {
                  // For select fields, ensure we use the option id, not the option text
                  if (item.val === null || item.val === undefined || item.val === '') {
                    this.final_fields[item.field_id] = null;
                  } else {
                    // First, try to find by id (handle both number and string)
                    const matchingOptionById = field.options.find(opt => 
                      opt.id == item.val || String(opt.id) === String(item.val) || opt.id === parseInt(item.val)
                    );
                    
                    if (matchingOptionById) {
                      // Found by id, use the id
                      this.final_fields[item.field_id] = matchingOptionById.id;
                    } else {
                      // Try to find by option text/value
                      const matchingOptionByText = field.options.find(opt => 
                        opt.option === item.val || String(opt.option) === String(item.val)
                      );
                      
                      if (matchingOptionByText) {
                        // Found by text, use the id
                        this.final_fields[item.field_id] = matchingOptionByText.id;
                      } else {
                        // Try parsing as number
                        const parsedId = parseInt(item.val);
                        if (!isNaN(parsedId) && field.options.some(opt => opt.id === parsedId)) {
                          this.final_fields[item.field_id] = parsedId;
                        } else {
                          // Fallback: use the value as is (might be id already)
                          this.final_fields[item.field_id] = item.val;
                        }
                      }
                    }
                  }
                } else {
                  this.final_fields[item.field_id] = item.val;
                }
              }
            })
          }
        })
      } else {
        this.fields = [];
      }
    },
    Get_Provinces(){
      Stores_Locations().Provinces().then(res=>{
        this.provinces = res.data.result;
        // Load cities for the customer's current province
        this.Get_Cities();
      })
    },
    Get_Cities(){
      if (this.item.province_id && this.provinces.length > 0){
        const selectedProvince = this.provinces.find(province => province.id === this.item.province_id);
        if (selectedProvince && selectedProvince.cities) {
          this.cities = selectedProvince.cities;
        } else {
          this.cities = [];
        }
      } else {
        this.cities = [];
      }
    }
  }
}
</script>

<template>
  <template v-if="customer">
    <div class="mt-3" @keyup.enter="Edit_Customer">
      <v-row>
        <v-col md="4" cols="12" class="pb-0">
          <v-text-field :error="Validation_Check(errors,'name')" v-model="item.name" append-inner-icon="mdi-account text-primary" rounded variant="outlined" type="text" label="نام کامل" />
          <validation_errors :errors="Validation_Errors(errors,'name')"></validation_errors>
        </v-col>
        <v-col md="4" cols="12" class="pb-0">
          
          <v-select
          v-if="provinces.length"
                  :items="provinces"
                  v-model="item.province_id"
                  item-title="name"
                  item-value="id"
                  rounded
                  append-inner-icon="mdi-city text-primary"
                  label="انتخاب استان"
                  variant= "outlined"
                @update:model-value="Get_Cities"
              >
          </v-select>
          <validation_errors :errors="Validation_Errors(errors,'province_id')"></validation_errors>
        </v-col>
        <v-col md="4" cols="12" class="pb-0">
            <v-select
              :items="cities"
              v-model="item.city_id"
              item-title="name"
              item-value="id"
              rounded
              append-inner-icon="mdi-city text-primary"
              label="انتخاب شهر"
              variant= "outlined"
              no-data-text="لطفا استان را انتخاب کنید"
          >
          </v-select>
          <validation_errors :errors="Validation_Errors(errors,'city_id')"></validation_errors>
        </v-col>


        <v-col md="4" cols="12" class="pb-0">
          <v-text-field :error="Validation_Check(errors,'instagram_id')" v-model="item.instagram_id" append-inner-icon="mdi-instagram text-primary" rounded variant="outlined" type="text" label="اینستاگرام" />
          <validation_errors :errors="Validation_Errors(errors,'instagram_id')"></validation_errors>
        </v-col>
        <v-col md="4" cols="12" class="pb-0">
          <v-text-field :error="Validation_Check(errors,'telegram_id')" v-model="item.telegram_id" append-inner-icon="mdi-send text-primary" rounded variant="outlined" type="text" label="تلگرام" />
          <validation_errors :errors="Validation_Errors(errors,'telegram_id')"></validation_errors>
        </v-col>
        <v-col md="4" cols="12">
          <v-text-field :error="Validation_Check(errors,'email')" v-model="item.email" append-inner-icon="mdi-email text-primary" rounded variant="outlined" type="email" label="ایمیل" />
          <validation_errors :errors="Validation_Errors(errors,'email')"></validation_errors>
        </v-col>
        <v-col md="4" cols="12">
          <v-text-field :error="Validation_Check(errors,'national_code')" v-model="item.national_code" append-inner-icon="mdi-card-account-details text-primary" rounded variant="outlined" type="number" label="کد ملی" />
          <validation_errors :errors="Validation_Errors(errors,'national_code')"></validation_errors>
        </v-col>
        <v-col md="4" cols="12">
          <v-text-field :error="Validation_Check(errors,'tel')" v-model="item.tel" append-inner-icon="mdi-phone text-primary" rounded variant="outlined" type="number" label="تلفن ثابت" />
          <validation_errors :errors="Validation_Errors(errors,'tel')"></validation_errors>
        </v-col>
        <v-col md="4" cols="12">
          <v-text-field :error="Validation_Check(errors,'postal_code')" v-model="item.postal_code" append-inner-icon="mdi-mailbox text-primary" rounded variant="outlined" type="number" label="کد پستی" />
          <validation_errors :errors="Validation_Errors(errors,'postal_code')"></validation_errors>
        </v-col>

        <v-col cols="12" >
          <div class="text-subtitle-1 font-weight-medium text-blue-darken-2 mb-3">اطلاعات مشتری در پروژه</div>
        </v-col>
        <template v-if="fields.length">
          <v-col v-for="field in fields" :key="field.id" md="4" cols="12">
            <!-- Text Field -->
            <v-text-field 
              v-if="field.type === 'text'"
              v-model="final_fields[field.id]" 
              rounded 
              variant="outlined" 
              type="text" 
              :label="field.title"
              :placeholder="field.placeholder"
              :hint="field.description"
              persistent-hint
            />
            
            <!-- Select Field -->
            <v-select
              v-else-if="field.type === 'select'"
              v-model="final_fields[field.id]"
              :items="field.options"
              item-title="option"
              item-value="id"
              rounded
              variant="outlined"
              :label="field.title"
              :placeholder="field.placeholder"
              :hint="field.description"
              persistent-hint
              no-data-text="گزینه‌ای موجود نیست"
            />
            
            <!-- Checkbox Field -->
            <v-checkbox
              v-else-if="field.type === 'checkbox'"
              v-model="final_fields[field.id]"
              :label="field.title"
              :hint="field.description"
              persistent-hint
              color="primary"
              hide-details="auto"
            >
              <template v-slot:label>
                <div>
                  <div>{{ field.title }}</div>
                  <div v-if="field.description" class="text-caption text-grey">{{ field.description }}</div>
                </div>
              </template>
            </v-checkbox>
            
            <!-- Date Field -->
            <div v-else-if="field.type === 'date'" class="mb-3">
              <div class="custom-date-input-wrapper">
                <input
                  type="text"
                  :class="`custom-date-input-${field.id}`"
                  class="custom-date-input"
                  :value="Get_Formatted_Date(field.id)"
                  :placeholder="field.placeholder || 'انتخاب تاریخ'"
                  readonly
                />
                <label class="custom-date-label">{{ field.title }}</label>
                <i class="mdi mdi-calendar custom-date-icon"></i>
              </div>
              <date-picker  
                compact-time 
                auto-submit 
                color="#5c6bc0"  
                type="date" 
                v-model="final_fields[field.id]" 
                format="YYYY-MM-DD" 
                display-format="jYYYY-jMM-jDD"
                :custom-input="Get_Date_Input_Selector(field.id)"
              />
              <div v-if="field.description" class="text-caption text-grey mt-1">{{ field.description }}</div>
            </div>
            
            <!-- Number Field -->
            <v-text-field 
              v-else-if="field.type === 'number'"
              v-model="final_fields[field.id]" 
              rounded 
              variant="outlined" 
              type="number" 
              :label="field.title"
              :placeholder="field.placeholder"
              :hint="field.description"
              persistent-hint
            />
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
/* Custom date input styling to match Vuetify */
.custom-date-input-wrapper {
  position: relative;
  margin-bottom: 8px;
}

.custom-date-input {
  width: 100%;
  padding: 16px 14px;
  padding-right: 40px;
  border: 1px solid rgba(0, 0, 0, 0.38);
  border-radius: 4px;
  font-size: 16px;
  background-color: transparent;
  transition: border-color 0.2s;
  cursor: pointer;
}

.custom-date-input:focus {
  outline: none;
  border-color: #1976d2;
  border-width: 2px;
}

.custom-date-input:hover {
  border-color: rgba(0, 0, 0, 0.87);
}

.custom-date-label {
  position: absolute;
  right: 14px;
  top: -8px;
  background-color: white;
  padding: 0 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  pointer-events: none;
  transition: color 0.2s;
}

.custom-date-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(0, 0, 0, 0.54);
  font-size: 20px;
  pointer-events: none;
}

.custom-date-input-wrapper:hover .custom-date-icon {
  color: rgba(0, 0, 0, 0.87);
}

.custom-date-input:focus + .custom-date-label + .custom-date-icon {
  color: #1976d2;
}
</style>