<script>
import {Stores_Customer} from "@/stores/customers/customers.js";

export default {
  name: "Customer_Profile_Reports",
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
        per_page : 30,
        page : 1,
        search :{}
      },
      pagination: {
        current: 1,
        total: 0,
        per_page: 30,
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
      Stores_Customer().Reports_Index(this.query_params).then(res=>{
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
    <!-- Section Header -->
    <div class="section-header">
      <h2 class="section-title">لیست گزارشات مشتری</h2>
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
            <no_items  width="200" text="هیچ گزارشی برای این مشتری ثبت نشده است"></no_items>
          </div>
        </template>
        <template v-else>
          <div class="mt-10">
            <div v-for="item in items" class="animate__animated animate__zoomInDown">
              <report_single class="mb-6" :report="item"></report_single>
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
/* Section Header */
.section-header {
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e3f2fd;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  right: 0;
  width: 60px;
  height: 2px;
  background: #009688; /* Teal color for reports */
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
}

/* Mobile Responsive */
@media (max-width: 960px) {
  .section-header {
    margin-bottom: 20px;
    padding-bottom: 10px;
  }
  
  .section-title {
    font-size: 18px;
  }
}

@media (max-width: 600px) {
  .section-header {
    margin-bottom: 16px;
    padding-bottom: 8px;
  }
  
  .section-title {
    font-size: 16px;
  }
}
</style>