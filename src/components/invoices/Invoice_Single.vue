<script>
export default {
  name: "Invoice_Single",
  props:['invoice'],

}
</script>

<template>

  <v-card v-if="invoice" hover variant="outlined" color="blue-grey-lighten-3" class="rounded">
    <v-card-item class="text-black pa-3">
      <div class="mb-4">
        <chips_user :user="invoice.user"></chips_user>
        <chips_date class="float-left" :date="invoice.created_at" format="jYYYY/jM/jD - H:m:s"></chips_date>
      </div>
      <div class="mt-6 mb-4">
        <strong>مبلغ فاکتور : </strong> <strong class="text-teal font-18">{{ this.$filters.number_format(invoice.amount) }}</strong><span class="ms-2 text-grey-darken-2">تومان</span>
        <div class="mt-4">
          <strong>توضیحات : </strong><span>{{ invoice.description }}</span>
        </div>
      </div>
      <div v-if="invoice.file_url" class="mt-3 mb-3">
        <v-btn @click="Helper_Downloader(invoice.file_url,invoice.file_name)" variant="outlined" rounded color="teal" append-icon="mdi-download font-22" text="دریافت فایل پیوست"></v-btn>
      </div>
      <div class="mt-4">
        <span class="text-grey-darken-2">پروژه : </span>
        <strong class="text-indigo">{{ invoice.project_customer.project.name }}</strong>
      </div>
    </v-card-item>
  </v-card>

</template>

<style scoped>

</style>