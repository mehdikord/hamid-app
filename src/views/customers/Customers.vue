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
          </v-row>

        </div>
      </div>
    </v-card-item>
  </v-card>

  <v-card flat border rounded class="mt-4">
    <v-card-item>
      <template v-if="items_loading">
        <v-row  class="mt-2">
          <v-col v-for="i in 6" xl="4" lg="6" md="6" sm="12" cols="12">
            <v-skeleton-loader type="list-item-avatar"></v-skeleton-loader>
          </v-col>
        </v-row>
      </template>
      <div v-else class="mt-3">
        <div v-if ="items.length < 1">
          <no_items text="هیچ شماره ( مشتری ) یافت نشد !"></no_items>
        </div>
        <div v-else>
          <v-row  class="mt-2">
            <v-col class="animate__animated animate__bounceInDown" v-for="item in items" xl="4" lg="6" md="6" sm="12" cols="12">
              <customer_item :customer="item"></customer_item>
            </v-col>
          </v-row>

        </div>

      </div>

    </v-card-item>
  </v-card>


</template>

<style scoped>

</style>