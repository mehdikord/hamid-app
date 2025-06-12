<script>
import {Stores_Statuses} from "@/stores/customers/statuses.js";
import {Stores_Customer} from "@/stores/customers/customers.js";
import {Stores_Projects} from "@/stores/projects/projects.js";

export default {
  name: "Customers",
  components:{

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
      add_report_dialog:[],
      add_invoice_dialog:[],
      query_params:{
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
      status_id:null,
      level_id:null,
      search_phone:null,
      statuses : [],
      levels : [],
      projects:[],
      project_id:null,
      items:[],
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
      Stores_Customer().Index_Seller(this.query_params).then(res => {
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
    Change_Per_Page(page){
      this.query_params.per_page = page;
      this.query_params.page = 1;
      this.Get_Items();
    },
    Change_Page(page){
      this.query_params.page = page;
      this.Get_Items();
    },
    Do_Search(){
      this.query_params.search.status_id = this.status_id;
      this.query_params.search.project_id = this.project_id;
      this.query_params.search.level_id = this.level_id;
      this.Get_Items();

    },
    Clear_phone(){
      this.search_phone = null;
      this.query_params.search.phone = null;
      this.Get_Items();
    },
    Create_Report(item){
      console.log(item);
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
    },
    Create_Invoice(item){
      if (item.project_customer_id){
        this.items = this.items.map(customer => {
          if (customer.project_customer_id === item.project_customer_id){
            customer.invoices_count+=1;
            this.add_invoice_dialog[customer.id] = false;

          }
          return customer;
        })
      }
      this.Notify_Success('فاکتور با موفقیت ثبت گردید');
    },

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
        <strong class="font-13 text-indigo">فیلتر و مرتب سازی : </strong>
        <div class="mt-4">
          <v-row>
            <v-col lg="3" md="3">
              <v-text-field clearable @click:clear="Clear_phone" class="animate__animated animate__zoomIn" hint="حداقل ۴ رقم وارد کنید " v-model="search_phone" density="comfortable" color="blue" label="جستجو با شماره موبایل" variant="outlined" rounded />
            </v-col>

            <v-col lg="3" md="3">
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
            <v-col lg="3" md="3">
              <v-select
                  class="animate__animated animate__zoomIn"
                  :items="levels"
                  v-model="level_id"
                  item-title="name"
                  item-value="id"
                  rounded
                  color="deep-orange-darken-2"
                  label="انتخاب مرحله مذاکره"
                  variant="outlined"
                  density="comfortable"
                  clearable
                  @update:model-value="Do_Search"
              >
              </v-select>
            </v-col>

            <v-col lg="3" md="3">
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
      </div>
    </v-card-item>
  </v-card>

  <v-card flat  rounded class="mt-4">
    <v-card-item>
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
          <v-table class="table-responsive" hover style="border-radius: 7px">
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
                <chips_customer_level :customer="item"></chips_customer_level>
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
                <v-btn @click="add_invoice_dialog[item.id] = true" density="comfortable" class="ms-2" color="blue-darken-2" variant="flat"  icon="mdi-currency-usd" title="ثبت فاکتور"></v-btn>
                <v-dialog
                    v-model="add_invoice_dialog[item.id]"
                    max-width="960"
                    transition="dialog-top-transition"

                >
                  <v-card variant="flat" rounded>
                    <v-card-item>
                      <v-btn @click="add_invoice_dialog[item.id] = false" variant="flat" class="float-end" icon="mdi-close" size="xx-small" color="red-darken-1"></v-btn>
                      <h3>ثبت فاکتور جدید برای مشتری</h3>
                    </v-card-item>
                    <v-divider/>
                    <v-card-item>
                      <actions_customer_invoice_create @Created="(item) => Create_Invoice(item)" :customer="item"></actions_customer_invoice_create>


                    </v-card-item>
                  </v-card>
                </v-dialog>

              </td>
            </tr>
            </tbody>
          </v-table>
          <v-divider class="mt-3"/>
          <div class="mt-8">
            <actions_data_pagination @PerPageChange="(page) => Change_Per_Page(page)" @ChangePage="(page) => Change_Page(page)" :data="pagination"></actions_data_pagination>
          </div>
        </div>
      </div>
    </v-card-item>

  </v-card>


</template>

<style scoped>

</style>