<script>
import {Stores_Statuses} from "@/stores/customers/statuses.js";
import {Stores_Customer} from "@/stores/customers/customers.js";

export default {
name: "Actions_Customer_Status",
  props:{
    customer:Object,
    required:true
  },
  mounted(){
  if(this.customer.status){
    this.status_id = this.customer.status.id;
  }
  },
  data(){
    return {
      change_dialog : false,
      change_loading: false,
      status_id:null,
      description:null,
      statuses : [],
  }
  },
  methods:{
    Open_Dialog(){
      this.change_dialog = true;
      this.Get_Statuses();
    },
    Get_Statuses(){
      Stores_Statuses().All().then(res =>{
        this.statuses = res.data.result;
      }).catch(error =>{

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
        description : this.description,
      }
      console.log(params);
      Stores_Customer().Statuses_Store(params).then(res =>{
        this.change_loading = false;
        this.change_dialog = false;
        this.status_id=null;
        this.description=null
        this.Notify_Success('وضعیت مشتری باموفقیت تغییر کرد')
        this.$emit('Changed',res.data.result);
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
    <v-btn v-if="!customer.status" @click="Open_Dialog" variant="flat" color="grey-darken-3" size="small" class="font-14 mt-2" rounded>بدون وضعیت</v-btn>
    <v-btn v-else @click="Open_Dialog" variant="flat" :style="{'backgroundColor' : customer.status.color,'color' : 'white' }" size="small" class="font-14 mt-2" rounded>{{ customer.status.name }}</v-btn>


    <v-dialog
        v-model="change_dialog"
        max-width="600"
        transition="dialog-top-transition"

    >
      <v-card variant="flat" rounded>
         <v-card-item>
           <v-btn @click="change_dialog = false" variant="flat" class="float-end" icon="mdi-close" size="xx-small" color="red-darken-1"></v-btn>
           <h3>تغییر وضعیت مشتری در پروژه </h3>
         </v-card-item>
         <v-divider/>
        <v-card-item>
          <v-row>
            <v-col>
              <div>
                <v-icon icon="mdi-cellphone font-30" color="indigo"></v-icon>
                <span class="text-grey-darken-3 font-13">شماره موبایل : </span>
                <strong>{{ customer.customer.phone}}</strong>
              </div>
            </v-col>
            <v-col>
              <div>
                <v-icon icon="mdi-account font-30" color="indigo"></v-icon>
                <span class="text-grey-darken-3 font-13"> نام مشتری : </span>
                <strong>{{ customer.customer.name ?? '---'}}</strong>
              </div>
            </v-col>
            <v-col cols="12">
              <div>
                <v-icon icon="mdi-instagram font-30" color="indigo"></v-icon>
                <span class="text-grey-darken-3 font-13"> اینستاگرام : </span>
                <strong>{{ customer.customer.instagram_id ?? '---'}}</strong>
              </div>
            </v-col>
          </v-row>
          <div class="mt-4">
            <label>انتخاب وضعیت جدید</label>
            <v-select
                class="mt-3"
                :items="statuses"
                v-model="status_id"
                item-title="name"
                item-value="id"
                rounded
                color="blue"
                variant="outlined"
                density="comfortable"
            >

            </v-select>
          </div>
          <div>
            <label>توضحات (اختیاری)</label>
             <v-textarea
             rounded
             variant="outlined"
             density="comfortable"
             color="blue"
             rows="3"
             v-model="description"
             >

             </v-textarea>
          </div>
        </v-card-item>
        <v-card-actions class="pb-5">
          <v-btn @click="change_dialog=false" variant="flat" rounded color="grey-darken-2" text="بستن" append-icon="mdi-close" ></v-btn>
          <v-btn :loading="change_loading" @click="Change_Status" variant="flat" rounded color="success" text="تغییر وضعیت و ثبت اطلاعات" append-icon="mdi-check"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </template>



</template>

<style scoped>

</style>