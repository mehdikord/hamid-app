<script>
import {Stores_Statuses} from "@/stores/customers/statuses.js";
import {Stores_Customer} from "@/stores/customers/customers.js";

import {Stores_Projects} from "@/stores/projects/projects.js";
import Customers_Consultant_Item from "@/views/customers/components/Customers_Consultant_Item.vue";

export default {
  name: "Customers",
  components:{
    'consultant_item' : Customers_Consultant_Item
  },
  mounted() {
    this.Get_Statuses();
    this.Get_Levels();
    this.Get_Projects();
    this.Get_Items();

  },
  data(){
    return {
      items_loading:true,
      items_loading_old:true,
      add_report_dialog:[],
      query_params:{
        sort_by : 'id',
        sort_type : 'desc',
        per_page : 15,
        page : 1,
        search :{}
      },
      query_params_old:{
        sort_by : 'id',
        sort_type : 'desc',
        per_page : 15,
        page : 1,
        search :{}
      },
      pagination: {
        current: 1,
        total: 0,
        per_page: 15,
        last_page: 1,
        from: 1,
        to: 1,
        links:[]
      },
      pagination_old: {
        current: 1,
        total: 0,
        per_page: 15,
        last_page: 1,
        from: 1,
        to: 1,
        links:[]
      },

      status_id:null,
      level_id:null,
      search_phone:null,
      statuses : [],
      levels : [],
      projects:[],
      project_id:null,
      items:[],
      items_old:[],
      show_old:false,
      show_filter:false,
    }
  },
  watch: {
    search_phone(newValue, oldValue) {

      newValue.replace(/\s/g, '');
      if (/^[0-9]+$/.test(newValue) && newValue.length >= 4) {
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
    Get_Statuses(){
      Stores_Statuses().All().then(res =>{
        this.statuses = res.data.result;
      }).catch(error =>{

      })
    },
    Get_Levels(){
      Stores_Customer().Levels_All().then(res =>{
        this.levels = res.data.result;
      }).catch(error =>{
      })
    },
    Get_Projects(){
      Stores_Projects().All().then(res =>{
        this.projects = res.data.result;
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
        console.log(this.items)
        this.items_loading=false;
      }).catch((error) => {
        this.items_loading=false;
      })
    },
    Get_Items_Old(){
      this.items_loading_old=true;
      Stores_Customer().Index_Consultant_Old(this.query_params_old).then(res => {
        this.items_old = res.data.result.data
        if (res.data.result){
          this.pagination_old.current = res.data.result.current_page;
          this.pagination_old.per_page = res.data.result.per_page;
          this.pagination_old.from = res.data.result.from;
          this.pagination_old.to = res.data.result.to;
          this.pagination_old.total = res.data.result.total;
          this.pagination_old.last_page = res.data.result.last_page;
          this.pagination_old.links = res.data.result.links;
        }
        console.log(this.items)
        this.items_loading_old=false;
      }).catch((error) => {
        this.items_loading_old=false;
      })
    },
    Change_Per_Page(page){
      this.query_params.per_page = page;
      this.query_params.page = 1;
      this.Get_Items();
    },
    Change_Page(page){
      this.query_params.page = page;
      this.Get_Items();
    },
    Change_Per_Page_Old(page){
      this.query_params_old.per_page = page;
      this.query_params_old.page = 1;
      this.Get_Items_Old();
    },
    Change_Page_Old(page){
      this.query_params_old.page = page;
      this.Get_Items_Old();
    },
    Do_Search(){
      this.query_params.search.status_id = this.status_id;
      this.query_params.search.project_id = this.project_id;
      this.query_params_old.search.status_id = this.status_id;
      this.query_params_old.search.project_id = this.project_id;
      this.Get_Items();
      if (this.show_old){
        this.Get_Items_Old();
      }
    },
    Clear_phone(){
      this.search_phone = null;
      this.query_params.search.phone = null;
      this.Get_Items();
    },
    Show_Old(){
      this.show_old = !this.show_old;
      if (this.show_old){
        this.Get_Items_Old();
      }
    },
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
    }
  }
}
</script>

<template>
  <v-card flat border rounded>
    <v-card-item>
      <div>
        <v-icon icon="mdi mdi-face-agent" size="35" color="deep-orange-darken-2" class="me-2"></v-icon>
        <strong class="color-dark-text font-15">لیست شماره های در حال مشاوره</strong>
      </div>
      <div class="mt-4">
        <strong v-if="this.$vuetify.display.mdAndUp" class="font-13 text-indigo">فیلتر و مرتب سازی : </strong>
        <div v-if="!this.$vuetify.display.mdAndUp" class="text-center">
          <v-btn class="mb-2" color="teal-darken-4" @click="show_filter = !show_filter" density="compact" variant="tonal" rounded>فیلتر و مرتب سازی</v-btn>
        </div>
        <div class="mt-4 hidden-xs">
          <v-row>
            <v-col lg="3" md="3" cols="12">
              <v-text-field clearable @click:clear="Clear_phone" class="animate__animated animate__zoomIn" hint="حداقل ۴ رقم وارد کنید " v-model="search_phone" density="comfortable" color="blue" label="جستجو با شماره موبایل" variant="outlined" rounded />
            </v-col>
            <v-col lg="3" md="3" cols="12">
              <v-select
                  class="animate__animated animate__zoomIn"
                  :items="projects"
                  v-model="project_id"
                  item-title="name"
                  item-value="id"
                  rounded
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
                  class="animate__animated animate__zoomIn"
                  :items="statuses"
                  v-model="status_id"
                  item-title="name"
                  item-value="id"
                  rounded
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
        <div v-show="show_filter" class="mt-4">
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-text-field clearable @click:clear="Clear_phone" class="animate__animated animate__zoomIn" hint="حداقل ۴ رقم وارد کنید " v-model="search_phone" density="compact" color="blue" label="جستجو با شماره موبایل" variant="outlined" rounded />
            </v-col>
            <v-col cols="12" class="py-0">
              <v-select
                  class="animate__animated animate__zoomIn"
                  :items="projects"
                  v-model="project_id"
                  item-title="name"
                  item-value="id"
                  rounded
                  color="deep-orange-darken-2"
                  label="انتخاب پروژه"
                  variant="outlined"
                  density="compact"
                  clearable
                  @update:model-value="Do_Search"
              >
              </v-select>
            </v-col>
            <v-col cols="12" class="py-0">
              <v-select
                  class="animate__animated animate__zoomIn"
                  :items="statuses"
                  v-model="status_id"
                  item-title="name"
                  item-value="id"
                  rounded
                  color="deep-orange-darken-2"
                  label="انتخاب وضعیت مشتری"
                  variant="outlined"
                  density="compact"
                  clearable
                  @update:model-value="Do_Search"
              >
              </v-select>
            </v-col>
          </v-row>
        </div>
      </div>

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
              <th>تاریخ تخصیص</th>
              <th>
                مشتری
              </th>
              <th>وضعیت</th>
              <th>پروژه</th>
              <th>آخرین گزارش</th>
              <th class="text-center">عملیات</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items" class="animate__animated animate__fadeIn" >
              <td>
                <chips_date :date="item.start_at"></chips_date>
              </td>
              <td class="pa-2">
                <router-link :to="{name:'customers_profile',params:{id:item.customer.id}}">
                  <v-icon icon="mdi-account font-29" color="deep-orange-darken-3"></v-icon>
                  <strong class="font-14 text-black">{{ item.customer.phone}}</strong>
                  <template v-if=" item.customer.name">
                    <span class="ms-2 text-grey-darken-4 font-14">( {{item.customer.name}} )</span>
                  </template>
                </router-link>
              </td>
              <td class="pa-2">
                <chips_customer_status :customer="item"></chips_customer_status>
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
              <td class="pa-2 text-center">
                <v-btn @click="add_report_dialog[item.id] = true" color="teal" density="comfortable" variant="flat" icon="mdi-text-box-edit" title="ثبت گزارش"></v-btn>
                <v-dialog
                    v-model="add_report_dialog[item.id]"
                    max-width="960"
                    transition="dialog-top-transition"
                >
                  <v-card variant="flat" rounded>
                    <v-card-item>
                      <v-btn @click="add_report_dialog[item.id] = false" variant="flat" class="float-end" icon="mdi-close" size="xx-small" color="red-darken-1"></v-btn>
                      <h3>ثبت گزارش جدید برای مشتری</h3>
                    </v-card-item>
                    <v-divider/>
                    <v-card-item>
                      <actions_customer_report_create @Created="(item) => Create_Report(item)" :customer="item"></actions_customer_report_create>
                    </v-card-item>
                  </v-card>
                </v-dialog>
              </td>
            </tr>
            </tbody>
          </v-table>
          <div v-if="!this.$vuetify.display.mdAndUp" >
            <div v-for="item in items" class="animate__animated animate__fadeIn mb-6">
              <consultant_item @Set_Report = "(item) => Create_Report(item)" :customer="item"></consultant_item>
            </div>
          </div>

          <v-divider class="mt-3"/>
          <div class="mt-8">
            <actions_data_pagination @PerPageChange="(page) => Change_Per_Page(page)" @ChangePage="(page) => Change_Page(page)" :data="pagination"></actions_data_pagination>
          </div>
        </div>
      </div>
    </v-card-item>
    <v-divider class="mb-6"/>
    <v-alert @click="Show_Old" color="blue-grey-lighten-4" class="rounded-lg cursor-pointer">
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

        </div>
      </div>
    </div>
  </v-card>


</template>

<style scoped>

</style>