<script>
import {Stores_Customer} from "@/stores/customers/customers.js";

export default {
  name: "Customer_Profile_Invoices",
  props:{
    customer:{
      type:Object,
      default:null
    }
  },
  mounted() {
    this.Get_Items();
  },
  data(){
    return {
      loading:true,
      query_params:{
        id : this.customer.id,
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
      items:[],
    }
  },
  methods:{
    Get_Items(){
      Stores_Customer().Invoices_Index(this.query_params).then(res=>{
        this.items=res.data.result.data;
        this.loading=false;
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
  }
}
</script>

<template>
  <div>
    <div class="mb-4 mt-2">
      <strong class="font-15">لیست فاکتور های ثبت شده برای مشتری</strong>
    </div>
    <div>
      <template v-if="loading">
        <v-skeleton-loader
            v-for="i in 3"
            class="mb-3"
            type="article"
        ></v-skeleton-loader>
      </template>
      <template v-else>
        <template v-if="!items.length">
          <div class="mt-5">
            <no_items  width="200" text="هیچ فاکتوری برای این مشتری ثبت نشده است"></no_items>
          </div>
        </template>
        <template v-else>
          <div class="mt-10">
            <div v-for="item in items" class="animate__animated animate__zoomInDown">
              <invoice_single class="mb-6" :invoice="item"></invoice_single>
            </div>
          </div>
          <div class="mt-12">
            <actions_data_pagination @PerPageChange="(page) => Change_Per_Page(page)" @ChangePage="(page) => Change_Page(page)" :data="pagination"></actions_data_pagination>
          </div>
        </template>

      </template>
    </div>
  </div>
</template>

<style scoped>

</style>