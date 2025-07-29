<script>
export default {
  name: "Customers_Consultant_Item",
  props: {
    customer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      add_report_dialog:false,

    }
  },
  methods: {
    Create_Report(item){
      this.$emit('Set_Report',item)
      this.add_report_dialog=false;
    }
  },
  mounted() {

  }
}
</script>

<template>

  <template v-if="customer">
    <v-card border variant="flat">
      <v-card-item>
        <v-row>
          <v-col cols="7">
            <v-icon icon="mdi mdi-cellphone" color="teal-darken-2" size="24"></v-icon>
            <strong class="font-15 ms-2">{{ customer.customer.phone }}</strong>
          </v-col>
          <v-col cols="5" class="text-end">
            <v-chip v-if="!customer.level" density="compact" text="بدون مرحله" class="font-12" color="blue-grey-darken-4"></v-chip>
            <v-chip v-else :style="{'backgroundColor' : customer.level.color}" density="compact" :text="customer.level.name" class="font-12"></v-chip>
          </v-col>
        </v-row>
        <div class="mt-2">
          <span class="text-grey-darken-4 font-13">نام : </span>
          <strong class="font-13 ms-2 font-weight-600">{{ customer.customer.name }}</strong>
        </div>
        <div class="mt-2">
          <span class="text-grey-darken-4 font-13">پروژه : </span>
          <strong class="font-13 ms-2 font-weight-500 text-teal-darken-2">{{ customer.project.name }}</strong>
        </div>
        <div class="mt-2">
          <span class="text-grey-darken-4 font-13">وضعیت : </span>
          <template  v-if="!customer.status">
            <v-icon icon="mdi mdi-close" color="red" size="14"></v-icon>
            <strong class="font-13 ms-1 font-weight-500">بدون وضعیت</strong>
          </template>
          <template v-else>
            <strong :style="{'color' : customer.status.color}" class="font-13 ms-1 font-weight-600">{{ customer.status.name }}</strong>
          </template>
        </div>
        <div class="mt-2">
          <span class="text-grey-darken-4 font-13">ثبت : </span>
          <strong class="font-13 ms-2 font-weight-600 text-grey-darken-3">{{ this.$filters.date_jalali( customer.cretad_at,'jYYYY/jM/jD') }}</strong>
        </div>
        <div class="mt-2">
          <span class="text-grey-darken-4 font-13">آخرین گزارش : </span>
          <template v-if="customer.last_report">
            <strong class="font-13 text-blue-darken-3">{{ this.$filters.date_jalali(customer.last_report.created_at,'jYYYY/jM/jD') }}</strong> :
            <strong v-if="customer.last_report" class="font-13 ms-1 font-weight-500">
              {{ customer.last_report.report }}
            </strong>
          </template>

        </div>
        <div class="mt-4">
          <v-divider/>
        </div>
        <div class=" mt-2">
          <v-btn :to="{name:'customers_profile',params:{id:customer.customer.id}}" class="me-3" color="deep-orange-darken-2" size="30" variant="flat" icon="mdi-account font-22" title="پروفایل"></v-btn>
          <v-btn @click="add_report_dialog = true" color="teal" size="30" variant="flat" icon="mdi-text-box-edit font-22" title="ثبت گزارش"></v-btn>
          <v-dialog
              v-model="add_report_dialog"
              max-width="960"
              transition="dialog-top-transition"
          >
            <v-card variant="flat" rounded>
              <v-card-item>
                <v-btn @click="add_report_dialog = false" variant="flat" density="compact" class="float-end" icon="mdi-close font-18" size="20" color="red-darken-1"></v-btn>
                <h4>ثبت گزارش جدید برای مشتری</h4>
              </v-card-item>
              <v-divider/>
              <v-card-item>
                <actions_customer_report_create @Created="(item) => Create_Report(item)" :customer="customer"></actions_customer_report_create>
              </v-card-item>
            </v-card>
          </v-dialog>
          <v-chip  density="compact" :text="this.$filters.date_jalali( customer.start_at,'jYYYY/jM/jD')" class="font-11 float-start mt-1" color="green-darken-4"></v-chip>

        </div>
      </v-card-item>
    </v-card>
  </template>

</template>

<style scoped>

</style>