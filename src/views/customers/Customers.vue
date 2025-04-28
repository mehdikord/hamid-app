<script>
import {Stores_Statuses} from "@/stores/customers/statuses.js";
import {Stores_Customer} from "@/stores/customers/customers.js";
import Customers_Item from "@/views/customers/components/Customers_Item.vue";

export default {
  name: "Customers",
  components:{
    'customer_item' : Customers_Item
  },
  mounted() {
    this.Get_Statuses();
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
      statuses : [],
      items:[],

    }
  },
  methods:{
    Get_Statuses(){
      Stores_Statuses().All().then(res =>{
        this.statuses = res.data.result;
      }).catch(error =>{

      })
    },
    Get_Items(){
      Stores_Customer().Index(this.query_params).then(res => {
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
    Change_Status(item){
      this.items = this.items.map(customer => {
        if (item.id === customer.id){
          return item;
        }
        return customer;
      })
    },
    Create_Report(item){
      if (item.project_customer_id){
        this.items = this.items.map(customer => {
          if (customer.id === item.project_customer_id){
            customer.last_report = item;
          }
          return customer;
        })
      }
      this.add_report_dialog[item.project_customer_id] = false;
      this.Notify_Success('گزارش با موفقیت ثبت گردید');
    }


  }
}
</script>

<template>
  <v-card flat border rounded>
    <v-card-item>
      <div>
        <v-icon icon="mdi-account-multiple font-30" color="deep-orange-darken-1" class="me-2"></v-icon>
        <strong class="color-dark-text font-16">لیست شماره ها ( مشتریان )</strong>
      </div>
      <div class="mt-3">
        <strong class="font-14 text-indigo">فیلتر و مرتب سازی : </strong>
        <div class="mt-4">
          <v-row>
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
                  label="انتخاب پروژه"
                  variant="outlined"
                  density="comfortable"
                  clearable
              >
              </v-select>
            </v-col>
          </v-row>

        </div>
      </div>
    </v-card-item>
  </v-card>

  <v-card flat border rounded class="mt-4">
    <v-card-item>
      <v-alert class="animate__animated animate__bounce" rounded variant="tonal" text="برای تغییر وضعیت مشتری روی وضعیت آن کلیک کنید و برای مشاهده اطلاعات کامل مشتری با کلیلک شماره آن وارد پروفایل شوید" type="info" closable></v-alert>
    </v-card-item>
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
        <div v-else style="margin-bottom: 120px">
          <v-table class="table-responsive" hover style="border-radius: 10px">
            <thead>
              <tr class="bg-blue-grey-darken-3">
                <th>
                  مشتری
                </th>
                <th>وضعیت</th>
                <th>پروژه</th>
                <th>اطلاعات</th>
                <th>آخرین گزارش</th>
                <th class="text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" >
                <td class="pa-2">
                  <v-icon icon="mdi-account font-45" color="deep-orange-darken-3"></v-icon>
                  <strong class="font-16">{{ item.customer.phone}}</strong>
                  <template v-if=" item.customer.name">
                    <span class="ms-1">( {{item.customer.name}} )</span>
                  </template>
                </td>
                <td class="pa-2">
                  <actions_customer_status @Changed="(item) => Change_Status(item)" :customer="item"></actions_customer_status>
                </td>
                <td class="pa-2">
                  <strong>{{ item.project.name }}</strong>
                </td>
                <td class="pa-2">
                  <span>
                    <span>فاکتورها : </span>
                    <strong class="text-blue-darken-2 font-18">15</strong>
                  </span>
                  <span class="ms-5">
                    <span>گزارشات : </span>
                    <strong class="text-teal font-18">15</strong>
                  </span>
                </td>
                <td class="pa-2">
                  <template v-if="item.last_report">
                    {{ this.Helper_Text_Shorter(item.last_report.report,50) }}

                  </template>
                </td>
                <td class="pa-2 text-center">
                  <v-btn @click="add_report_dialog[item.id] = true" color="teal" variant="flat" rounded append-icon="mdi-text-box-edit">ثبت گزارش</v-btn>
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


                  <v-btn @click="add_invoice_dialog[item.id] = true" class="ms-2" color="blue-darken-2" variant="flat" rounded append-icon="mdi-currency-usd">ثبت فاکتور</v-btn>

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
                        <template v-if="!item.target_price">

                        </template>
                        <template v-else>

                        </template>

                      </v-card-item>
                    </v-card>
                  </v-dialog>

                </td>
              </tr>
            </tbody>

          </v-table>





          <v-row  class="hidden-xl mt-2 mb-16">
            <v-col class="animate__animated animate__bounceInDown" v-for="item in items" cols="12">
              <customer_item @Emit_Change_Status="(item) => Change_Status(item)" :customer="item"></customer_item>
            </v-col>
          </v-row>

        </div>

      </div>
    </v-card-item>
  </v-card>


</template>

<style scoped>

</style>