<script>
import {Stores_Statuses} from "@/stores/customers/statuses.js";
import {Stores_Customer} from "@/stores/customers/customers.js";

import {Stores_Projects} from "@/stores/projects/projects.js";
import Customers_Consultant_Item from "@/views/customers/components/Customers_Consultant_Item.vue";
import Actions_Customer_Status from "@/components/actions/Actions_Customer_Status.vue";

export default {
  name: "Customers",
  components:{
    'consultant_item' : Customers_Consultant_Item,
    'actions_customer_status' : Actions_Customer_Status
  },
  mounted() {
    // this.Get_Statuses();
    // this.Get_Levels();
    this.Get_Projects();
    // Don't call Get_Items() here - it will be called after projects are loaded
  },
  data(){
    return {
      items_loading:true,
      // items_loading_old:true,
      add_report_dialog:[],
      query_params:{
        sort_by : 'id',
        sort_type : 'desc',
        per_page : 15,
        page : 1,
        search :{}
      },
      // query_params_old:{
      //   sort_by : 'id',
      //   sort_type : 'desc',
      //   per_page : 15,
      //   page : 1,
      //   search :{}
      // },
      pagination: {
        current: 1,
        total: 0,
        per_page: 15,
        last_page: 1,
        from: 1,
        to: 1,
        links:[]
      },
      // pagination_old: {
      //   current: 1,
      //   total: 0,
      //   per_page: 15,
      //   last_page: 1,
      //   from: 1,
      //   to: 1,
      //   links:[]
      // },

      status_id:null,
      level_id:null,
      search_phone:null,
      statuses : [],
      levels : [],
      projects:[],
      project_id:null,
      items:[],
      // items_old:[],
      // show_old:false,
      show_filter:false,
      selected_card_id: null,
    }
  },
  computed: {
    // Sort items to move successful/unsuccessful statuses to the end
    sortedItems() {
      if (!this.items || this.items.length === 0) return [];
      
      // Define status names that indicate final states (successful/unsuccessful)
      const finalStatusNames = [
        'موفق', 'ناموفق', 'تکمیل شده', 'انجام شده', 'پایان یافته',
        'موفقیت', 'شکست', 'تمام شده', 'خاتمه یافته', 'نهایی',
        'successful', 'unsuccessful', 'completed', 'finished', 'done',
        'success', 'failed', 'final', 'closed', 'ended'
      ];
      
      return [...this.items].sort((a, b) => {
        const aStatusName = a.status?.name?.toLowerCase() || '';
        const bStatusName = b.status?.name?.toLowerCase() || '';
        
        const aIsFinal = finalStatusNames.some(status => aStatusName.includes(status.toLowerCase()));
        const bIsFinal = finalStatusNames.some(status => bStatusName.includes(status.toLowerCase()));
        
        // If both are final or both are not final, maintain original order
        if (aIsFinal === bIsFinal) {
          return 0;
        }
        
        // Move final statuses to the end
        return aIsFinal ? 1 : -1;
      });
    }
  },
  watch: {
    search_phone(newValue, oldValue) {

      newValue.replace(/\s/g, '');
      if (newValue.length >= 4) {
        this.items_loading = true;
        setTimeout(() => {
          this.query_params.search.phone = newValue;
          this.Get_Items();
        },500);
      }else {

      }

    }
  },
  methods:{
    Get_Statuses(project){
      Stores_Statuses().All({"project_id":project}).then(res =>{
        this.statuses = res.data.result;
      }).catch(error =>{

      })
    },
    Get_Levels(project){
      Stores_Customer().Levels_All({"project_id":project}).then(res =>{
        this.levels = res.data.result;
      }).catch(error =>{
      })
    },
    Get_Projects(){
      Stores_Projects().All().then(res =>{
        this.projects = res.data.result;
        if(this.projects.length){
          // Sort projects by updated_at in descending order and select the most recent one
          const sortedProjects = this.projects.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
          this.project_id = sortedProjects[0].id
        }
        this.Get_Statuses(this.project_id);
        this.Get_Levels(this.project_id);
        // Set initial search params and fetch items
        this.query_params.search.project_id = this.project_id;
        this.Get_Items();
      }).catch(error =>{
      })
    },
    Get_Items(){
      this.items_loading=true;
      Stores_Customer().Index_Consultant(this.query_params).then(res => {
        this.items = res.data.result.data
        if (res.data.result){
          this.pagination.current = res.data.result.current_page;
          this.pagination.per_page = res.data.result.per_page;
          this.pagination.from = res.data.result.from;
          this.pagination.to = res.data.result.to;
          this.pagination.total = res.data.result.total;
          this.pagination.last_page = res.data.result.last_page;
          this.pagination.links = res.data.result.links;
        }
        this.items_loading=false;
      }).catch((error) => {
        this.items_loading=false;
      })
    },
    // Get_Items_Old(){
    //   this.items_loading_old=true;
    //   Stores_Customer().Index_Consultant_Old(this.query_params_old).then(res => {
    //     this.items_old = res.data.result.data
    //     if (res.data.result){
    //       this.pagination_old.current = res.data.result.current_page;
    //       this.pagination_old.per_page = res.data.result.per_page;
    //       this.pagination_old.from = res.data.result.from;
    //       this.pagination_old.to = res.data.result.to;
    //       this.pagination_old.total = res.data.result.total;
    //       this.pagination_old.last_page = res.data.result.last_page;
    //       this.pagination_old.links = res.data.result.links;
    //     }
    //     this.items_loading_old=false;
    //   }).catch((error) => {
    //     this.items_loading_old=false;
    //   })
    // },
    Change_Per_Page(page){
      this.query_params.per_page = page;
      this.query_params.page = 1;
      this.Get_Items();
    },
    Change_Page(page){
      this.query_params.page = page;
      this.Get_Items();
    },
    // Change_Per_Page_Old(page){
    //   this.query_params_old.per_page = page;
    //   this.query_params_old.page = 1;
    //   this.Get_Items_Old();
    // },
    // Change_Page_Old(page){
    //   this.query_params_old.page = page;
    //   this.Get_Items_Old();
    // },
    Do_Search(){
      this.Get_Statuses(this.project_id);
      this.Get_Levels(this.project_id);
      this.query_params.search.status_id = this.status_id;
      this.query_params.search.project_id = this.project_id;
      // this.query_params_old.search.status_id = this.status_id;
      // this.query_params_old.search.project_id = this.project_id;
      this.Get_Items();
      // if (this.show_old){
      //   this.Get_Items_Old();
      // }
    },
    Clear_phone(){
      this.search_phone = null;
      this.query_params.search.phone = null;
      this.Get_Items();
    },
    Clear_All_Filters(){
      this.search_phone = null;
      this.status_id = null;
      this.level_id = null;
      // Don't clear project_id - keep the selected project
      // this.project_id = null;
      this.query_params.search = {};
      // Set the project_id back in search params
      if (this.project_id) {
        this.query_params.search.project_id = this.project_id;
      }
      // this.query_params_old.search = {};
      this.Get_Items();
      // if (this.show_old){
      //   this.Get_Items_Old();
      // }
    },
    Select_Card(card_id){
      // If clicking the same card, deselect it
      if (this.selected_card_id === card_id) {
        this.selected_card_id = null;
      } else {
        // Immediately deselect any previously selected card
        this.selected_card_id = null;
        // Use a shorter timeout for faster response
        setTimeout(() => {
          this.selected_card_id = card_id;
        }, 50);
      }
    },
    // Show_Old(){
    //   this.show_old = !this.show_old;
    //   if (this.show_old){
    //     this.Get_Items_Old();
    //   }
    // },
    Create_Report(item){
      if (item.project_customer_id){
        this.items = this.items.map(customer => {
          if (customer.project_customer_id === item.project_customer_id){
            customer.last_report = item;
            this.add_report_dialog[customer.id] = false;
          }
          return customer;
        })
      }
      this.Notify_Success('گزارش با موفقیت ثبت گردید');
      // Refresh the table to show updated data
      this.items_loading = true;
      this.Get_Items();
    },
    openWhatsApp(phoneNumber) {
      // Remove any non-digit characters and ensure it starts with country code
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const whatsappPhone = cleanPhone.startsWith('98') ? cleanPhone : `98${cleanPhone}`;
      const message = encodeURIComponent('سلام');
      const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    },
    Change_Status(item) {
      this.items = this.items.map(get_items => {
        if (get_items.project_customer_id === item.project_customer_id) {
          return item;
        }
        return get_items;
      })
    }
  }
}
</script>

<template>
  <!-- Enhanced Mobile-Friendly Header -->
  <v-card flat rounded class="mobile-header-card">
    <v-card-item class="pa-4">
      <!-- Header with Search -->
      <div class="d-flex align-center justify-space-between mb-4">
        <div class="d-flex align-center">
          <v-icon icon="mdi-face-agent" size="28" color="deep-orange-darken-2" class="me-3"></v-icon>
          <div>
            <h2 class="text-h6 font-weight-bold mb-0">لیست شماره های در حال مشاوره</h2>
            <p class="text-caption text-medium-emphasis mb-0">{{ pagination.total }} مشتری</p>
          </div>
        </div>
        
        <!-- Mobile Filter Button -->
        <v-btn
          v-if="!this.$vuetify.display.mdAndUp"
          @click="show_filter = !show_filter"
          :color="show_filter ? 'primary' : 'grey-lighten-1'"
          variant="flat"
          size="small"
          rounded
          class="filter-toggle-btn"
        >
          <v-icon :icon="show_filter ? 'mdi-close' : 'mdi-filter'" size="18"></v-icon>
        </v-btn>
      </div>

      <!-- Quick Search Bar (Mobile Only) -->
      <v-text-field
        v-if="!this.$vuetify.display.mdAndUp"
        clearable
        @click:clear="Clear_phone"
        v-model="search_phone"
        density="compact"
        color="primary"
        label="جستجو با شماره موبایل یا نام"
        variant="outlined"
        rounded="lg"
        prepend-inner-icon="mdi-magnify"
        class="search-field custom-input"
        hint="حداقل ۴ کاراکتر وارد کنید"
        persistent-hint
      />

      <!-- Desktop Filters -->
      <div v-if="this.$vuetify.display.mdAndUp" class="mt-4">
        <strong class="font-13 text-indigo">فیلتر و مرتب سازی : </strong>
        <div class="mt-4 hidden-xs">
          <v-row>
            <v-col lg="3" md="3" cols="12">
              <v-text-field clearable @click:clear="Clear_phone" class="animate__animated animate__zoomIn custom-input" hint="حداقل ۴ کاراکتر وارد کنید " v-model="search_phone" density="comfortable" color="blue" label="جستجو با شماره موبایل یا نام" variant="outlined" rounded="lg" />
            </v-col>
            <v-col lg="3" md="3" cols="12">
              <v-select
                  class="animate__animated animate__zoomIn custom-select"
                  :items="projects"
                  v-model="project_id"
                  item-title="name"
                  item-value="id"
                  rounded="lg"
                  color="deep-orange-darken-2"
                  label="انتخاب پروژه"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  @update:model-value="Do_Search"
              >
              </v-select>
            </v-col>
            <v-col lg="3" md="3" cols="12">
              <v-select
                  class="animate__animated animate__zoomIn custom-select"
                  :items="statuses"
                  v-model="status_id"
                  item-title="name"
                  item-value="id"
                  rounded="lg"
                  color="deep-orange-darken-2"
                  label="انتخاب وضعیت مشتری"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  @update:model-value="Do_Search"
              >
              </v-select>
            </v-col>
          </v-row>
        </div>
      </div>

      <!-- Mobile Filter Panel -->
      <v-expand-transition>
        <div v-show="show_filter && !this.$vuetify.display.mdAndUp" class="mobile-filter-panel">
          <v-divider class="mb-4"></v-divider>
          <div class="d-flex align-center justify-space-between mb-3">
            <h3 class="text-subtitle-1 font-weight-bold mb-0">فیلترها</h3>
            <v-btn
              @click="Clear_All_Filters"
              color="grey"
              variant="text"
              size="small"
              class="text-caption"
            >
              پاک کردن همه
            </v-btn>
          </div>
          
          <v-row>
            <v-col cols="12" class="pb-2">
              <v-text-field
                clearable
                @click:clear="Clear_phone"
                v-model="search_phone"
                density="compact"
                color="primary"
                label="جستجو با شماره موبایل یا نام"
                variant="outlined"
                rounded="lg"
                prepend-inner-icon="mdi-magnify"
                class="custom-input"
                hint="حداقل ۴ کاراکتر وارد کنید"
                persistent-hint
              />
            </v-col>
            <v-col cols="12" class="py-2">
              <v-select
                :items="projects"
                v-model="project_id"
                item-title="name"
                item-value="id"
                rounded="lg"
                color="primary"
                label="پروژه"
                variant="outlined"
                density="compact"
                clearable
                class="custom-select"
                @update:model-value="Do_Search"
              />
            </v-col>
            <v-col cols="12" class="pt-2">
              <v-select
                :items="statuses"
                v-model="status_id"
                item-title="name"
                item-value="id"
                rounded="lg"
                color="primary"
                label="وضعیت مشتری"
                variant="outlined"
                density="compact"
                clearable
                class="custom-select"
                @update:model-value="Do_Search"
              />
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>

    </v-card-item>
  </v-card>

  <v-card flat rounded class="mt-4">
    <v-card-item :class="{'pa-0' : !this.$vuetify.display.mdAndUp}">
      <div class="mb-4">
        <div v-if="this.$vuetify.display.mdAndUp">
          <v-icon icon="mdi mdi-information" color="red-darken-3" size="30"></v-icon>
          <strong class="ms-2 font-15 text-deep-orange-darken-3">
            لیست شماره هایی که هنوز فرایند مشاوره آنها در جریان است
          </strong>
        </div>

      </div>
      <template v-if="items_loading">
        <v-row  class="mt-2">
          <v-col v-for="i in 6" xl="4" lg="6" md="6" sm="12" cols="12">
            <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
          </v-col>
        </v-row>
      </template>
      <div v-else class="mt-2">
        <div v-if ="items.length < 1">
          <no_items text="هیچ شماره ( مشتری ) یافت نشد !"></no_items>
        </div>
        <div v-else>
          <v-table v-if="this.$vuetify.display.mdAndUp" class="table-responsive" hover style="border-radius: 7px">
            <thead>
            <tr class="bg-grey-darken-3">
              <th class="text-center">تاریخ ها</th>
              <th>ورودی</th>
              <th>تگها</th>
              <th>
                مشتری
              </th>
              <th>مرحله</th>
              <th>وضعیت</th>
              <th>پروژه</th>
              <th>آخرین گزارش</th>
              <th class="text-center">عملیات</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in sortedItems" class="animate__animated animate__fadeIn" >
              <td class="pa-2">
                <div class="date-stack">
                  <chips_date color="indigo-darken-1" :date="item.created_at"></chips_date>
                  <chips_date color="teal-darken-1" :date="item.start_at"></chips_date>
                </div>
              </td>
              <td class="pa-2">
                <v-chip 
                  v-if="item.import_method && item.import_method.name" 
                  color="blue" 
                  variant="tonal" 
                  size="x-small"
                  class="font-weight-medium"
                >
                  {{ item.import_method.name }}
                </v-chip>
                <span v-else class="text-grey">-</span>
              </td>
              <td class="pa-2">
                <div v-if="item.tags && item.tags.length > 0" class="d-flex flex-wrap gap-1">
                  <v-chip 
                    v-for="tag in item.tags" 
                    :key="tag.name"
                    color="green" 
                    variant="tonal" 
                    size="x-small"
                    class="font-weight-medium"
                  >
                    {{ tag.name }}
                  </v-chip>
                </div>
                <span v-else class="text-grey">-</span>
              </td>
              <td class="pa-2">
                <router-link :to="{name:'customers_profile',params:{id:item.customer.id}}">
                  <div class="d-flex flex-column">
                    <strong class="font-14 text-black">{{ item.customer.phone}}</strong>
                    <template v-if=" item.customer.name">
                      <span class="text-grey-darken-4 font-12 mt-1">{{item.customer.name}}</span>
                    </template>
                  </div>
                </router-link>
              </td>
              <td class="pa-2">
                <actions_customer_status :customer="item" @changed="(item) => Change_Status(item)" :show_level="true"></actions_customer_status>
              </td>
              <td class="pa-2">
                <actions_customer_status :customer="item" @changed="(item) => Change_Status(item)"></actions_customer_status>
              </td>
              <td class="pa-2">
                <strong class="text-indigo-darken-1 font-12">{{ item.project.name }}</strong>
              </td>
              <td class="pa-2">
                <template v-if="item.last_report">
                  <chips_date :date="item.last_report.created_at"></chips_date> :
                  {{ this.Helper_Text_Shorter(item.last_report.report,15) }}
                </template>
              </td>
              <td class="pa-2 text-center" style="min-width: 120px;">
                <div class="operations-container">
                  <div class="operation-group">
                    <v-btn 
                      @click="add_report_dialog[item.id] = true" 
                      class="compact-operation-btn report-action"
                      size="x-small"
                      variant="text"
                    >
                      <span class="operation-label">گزارش</span>
                    </v-btn>
                    <v-btn 
                      @click="openWhatsApp(item.customer.phone)" 
                      class="compact-operation-btn whatsapp-action"
                      size="x-small"
                      variant="text"
                    >
                      <v-icon icon="mdi-whatsapp" size="14"></v-icon>
                    </v-btn>
                  </div>
                </div>
                <v-dialog
                    v-model="add_report_dialog[item.id]"
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
                            icon="mdi-text-box-edit"
                            color="teal-darken-2"
                            size="28"
                            class="me-3"
                          ></v-icon>
                          <div>
                            <h3 class="text-h5 font-weight-bold text-primary-darken-2 mb-0">
                              ثبت گزارش جدید
                            </h3>
                            <p class="text-grey-darken-1 mb-0 mt-1">
                              گزارش جدید برای مشتری {{ item.customer.name || item.customer.phone }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </v-card-item>
                    
                    <v-divider class="mx-4 mx-sm-6"></v-divider>
                    
                    <!-- Content Area -->
                    <v-card-item class="pa-4 pa-sm-6 pt-0">
                      <actions_customer_report_create 
                        @Created="(item) => Create_Report(item)" 
                        :customer="item"
                        :onCancel="() => add_report_dialog[item.id] = false"
                      ></actions_customer_report_create>
                    </v-card-item>
                  </v-card>
                </v-dialog>
              </td>
            </tr>
            </tbody>
          </v-table>
          <div v-if="!this.$vuetify.display.mdAndUp" >
            <div v-for="item in sortedItems" class="animate__animated animate__fadeIn mb-6">
              <consultant_item 
                @Set_Report = "(item) => Create_Report(item)" 
                @change_status = "(item) => Change_Status(item)"
                @select = "(card_id) => Select_Card(card_id)"
                :customer="item"
                :isSelected="selected_card_id === item.id"
              ></consultant_item>
            </div>
          </div>

          <v-divider class="mt-3"/>
          <div class="mt-8">
            <actions_data_pagination @PerPageChange="(page) => Change_Per_Page(page)" @ChangePage="(page) => Change_Page(page)" :data="pagination"></actions_data_pagination>
          </div>
        </div>
      </div>
    </v-card-item>
    <!-- <v-divider class="mb-6"/>
    <v-alert @click="Show_Old" color="blue-grey-lighten-4" class="custom-alert cursor-pointer">
      <div class="text-center">
        <span class="font-14 font-weight-500">مشاهده شماره های مشاوره شده پیشین</span>
      </div>
    </v-alert>
    <div v-if="show_old" class="mt-4">
      <div class="mb-4">
        <v-icon icon="mdi mdi-information" color="red-darken-3" size="30"></v-icon>
        <strong class="ms-2 font-15">
          لیست شماره هایی که مشاوره آنها انجام شده است
        </strong>
      </div>
      <template v-if="items_loading_old">
        <v-row  class="mt-2">
          <v-col v-for="i in 6" xl="4" lg="6" md="6" sm="12" cols="12">
            <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
          </v-col>
        </v-row>
      </template>
      <div v-else class="mt-2">
        <div v-if ="items_old.length < 1">
          <no_items text="هیچ شماره ( مشتری ) یافت نشد !"></no_items>
        </div>
        <div v-else>
          <v-table v-if="this.$vuetify.display.mdAndUp" class="table-responsive" hover style="border-radius: 7px">
            <thead>
            <tr class="bg-grey-darken-3">
              <th>تاریخ تخصیص</th>
              <th>
                مشتری
              </th>
              <th>مرحله</th>
              <th>وضعیت</th>
              <th>پروژه</th>
              <th>آخرین گزارش</th>
              <th class="text-center">عملیات</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items_old" class="animate__animated animate__fadeIn" >
              <td>
                <chips_date :date="item.start_at"></chips_date>
              </td>
              <td class="pa-2">
                <router-link :to="{name:'customers_profile',params:{id:item.customer.id}}">
                  <div class="d-flex flex-column">
                    <strong class="font-14 text-black">{{ item.customer.phone}}</strong>
                    <template v-if=" item.customer.name">
                      <span class="text-grey-darken-4 font-12 mt-1">{{item.customer.name}}</span>
                    </template>
                  </div>
                </router-link>
              </td>
              <td class="pa-2">
                <actions_customer_status :customer="item" @changed="(item) => Change_Status(item)" :show_level="true"></actions_customer_status>
              </td>
              <td class="pa-2">
                <actions_customer_status :customer="item" @changed="(item) => Change_Status(item)"></actions_customer_status>
              </td>
              <td class="pa-2">
                <strong class="text-indigo-darken-1">{{ item.project.name }}</strong>
              </td>
              <td class="pa-2">
                <template v-if="item.last_report">
                  <chips_date :date="item.last_report.created_at"></chips_date> :
                  {{ this.Helper_Text_Shorter(item.last_report.report,15) }}
                </template>
              </td>
              <td class="pa-2 text-center" style="min-width: 120px;">
                <div class="operations-container">
                  <div class="operation-group">
                    <v-btn 
                      @click="add_report_dialog[item.id] = true" 
                      class="compact-operation-btn report-action"
                      size="x-small"
                      variant="text"
                    >
                      <span class="operation-label">گزارش</span>
                    </v-btn>
                    <v-btn 
                      @click="openWhatsApp(item.customer.phone)" 
                      class="compact-operation-btn whatsapp-action"
                      size="x-small"
                      variant="text"
                    >
                      <v-icon icon="mdi-whatsapp" size="14"></v-icon>
                    </v-btn>
                  </div>
                </div>
                <v-dialog
                    v-model="add_report_dialog[item.id]"
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
                    <v-card-item class="pa-4 pa-sm-6">
                      <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                          <v-icon
                            icon="mdi-text-box-edit"
                            color="teal-darken-2"
                            size="28"
                            class="me-3"
                          ></v-icon>
                          <div>
                            <h3 class="text-h5 font-weight-bold text-primary-darken-2 mb-0">
                              ثبت گزارش جدید
                            </h3>
                            <p class="text-grey-darken-1 mb-0 mt-1">
                              گزارش جدید برای مشتری {{ item.customer.name || item.customer.phone }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </v-card-item>
                    
                    <v-divider class="mx-4 mx-sm-6"></v-divider>
                    
                    <v-card-item class="pa-4 pa-sm-6 pt-0">
                      <actions_customer_report_create 
                        @Created="(item) => Create_Report(item)" 
                        :customer="item"
                        :onCancel="() => add_report_dialog[item.id] = false"
                      ></actions_customer_report_create>
                    </v-card-item>
                  </v-card>
                </v-dialog>
              </td>
            </tr>
            </tbody>
          </v-table>
          <div v-if="!this.$vuetify.display.mdAndUp" >
            <div v-for="item in items_old" class="animate__animated animate__fadeIn mb-6">
              <consultant_item 
                @Set_Report = "(item) => Create_Report(item)" 
                @change_status = "(item) => Change_Status(item)"
                @select = "(card_id) => Select_Card(card_id)"
                :customer="item"
                :isSelected="selected_card_id === item.id"
              ></consultant_item>
            </div>
          </div>

          <v-divider class="mt-3"/>
          <div class="mt-8">
            <actions_data_pagination @PerPageChange="(page) => Change_Per_Page_Old(page)" @ChangePage="(page) => Change_Page_Old(page)" :data="pagination"></actions_data_pagination>
          </div>
        </div>
      </div>
    </div> -->
  </v-card>


</template>

<style scoped>

/* Enhanced Mobile Header Styles */
.mobile-header-card {
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
  border-radius: 12px !important;
}

/* Font consistency */
.mobile-header-card,
.mobile-header-card *,
.mobile-header-card h2,
.mobile-header-card p,
.mobile-header-card .v-btn,
.mobile-header-card .v-text-field,
.mobile-header-card .v-select {
  font-family: inherit !important;
}

.filter-toggle-btn {
  min-width: 40px !important;
  width: 40px !important;
  height: 40px !important;
  transition: all 0.3s ease !important;
}

.filter-toggle-btn:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.search-field {
  transition: all 0.3s ease !important;
}

.search-field:focus-within {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15) !important;
}

.mobile-filter-panel {
  background: transparent !important;
  border-radius: 12px !important;
  padding: 16px !important;
  margin-top: 8px !important;
  border: 1px solid rgba(var(--v-theme-outline), 0.2) !important;
}

/* Mobile filter panel animations */
.mobile-filter-panel .v-select {
  transition: all 0.3s ease !important;
}

.mobile-filter-panel .v-select:focus-within {
  transform: translateY(-1px) !important;
}

/* Active filter indicator */
.filter-toggle-btn[color="primary"] {
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3) !important;
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

.custom-alert {
  border-radius: 12px !important;
}

/* Date Stack Styling - Direct stacking without container */
.date-stack {
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 8px 0;
}

.date-stack :deep(.v-chip) {
  border-radius: 0 !important;
}

.date-stack :deep(.v-chip:first-child) {
  border-radius: 12px 12px 0 0 !important;
}

.date-stack :deep(.v-chip:last-child) {
  border-radius: 0 0 12px 12px !important;
}

/* Compact Operations Column - Minimalist Design */
.operations-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 2px;
}

.operation-group {
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.compact-operation-btn {
  position: relative !important;
  min-width: auto !important;
  height: 28px !important;
  padding: 0 8px !important;
  border-radius: 6px !important;
  font-weight: 500 !important;
  font-size: 11px !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  overflow: hidden !important;
  background: transparent !important;
  border: 1px solid transparent !important;
}

.compact-operation-btn .operation-label {
  font-size: 10px !important;
  font-weight: 600 !important;
  opacity: 0.8 !important;
  transition: all 0.3s ease !important;
}

/* Report Action Styling */
.report-action {
  color: #059669 !important;
}

.report-action:hover {
  background: rgba(5, 150, 105, 0.08) !important;
  border-color: rgba(5, 150, 105, 0.2) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.15) !important;
}

.report-action:hover .operation-label {
  opacity: 1 !important;
  color: #047857 !important;
}

/* WhatsApp Action Styling */
.whatsapp-action {
  color: #25d366 !important;
}

.whatsapp-action:hover {
  background: rgba(37, 211, 102, 0.08) !important;
  border-color: rgba(37, 211, 102, 0.2) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.15) !important;
}

.whatsapp-action:hover .v-icon {
  color: #128c7e !important;
}

/* Row Hover Effects */
.v-table tbody tr:hover .operation-group {
  background: rgba(0, 0, 0, 0.04) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
}

.v-table tbody tr:hover .compact-operation-btn {
  opacity: 1 !important;
}

/* Active State */
.compact-operation-btn:active {
  transform: translateY(0) scale(0.98) !important;
  transition: all 0.1s ease !important;
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
  
  .mobile-header-card .v-card-item {
    padding: 16px !important;
  }
  
  .mobile-header-card h2 {
    font-size: 1.1rem !important;
    line-height: 1.3 !important;
  }
}

/* Ensure proper title styling */
.v-dialog .v-card-item h3.text-h5 {
  font-family: inherit !important;
  font-weight: 700 !important;
  color: rgb(var(--v-theme-primary-darken-2)) !important;
  font-size: 1.5rem !important;
  line-height: 1.2 !important;
}

</style>