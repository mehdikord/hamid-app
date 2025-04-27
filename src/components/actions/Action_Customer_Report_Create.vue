<script>
export default {
  name: "Action_Customer_Report_Create",
  data(){
    return {
      loading:false,
      report:null,
      date:null,
      file:null

    }
  }
}
</script>

<template>
  <div class="mt-3">
    <div class="mb-3">
      <v-textarea
      variant="outlined"
      rows="3"
      label="متن گزارش"
      v-model="report"
      color="deep-orange-darken-2"
      >
      </v-textarea>
    </div>
    <div class="mb-3">
      <v-file-input v-model="file" hint="فایل های مجاز : تصویر - ویدئو - متن - صوت" color="deep-orange-darken-2" clearable label="انتخاب فایل" variant="outlined" density="comfortable" prepend-icon="mdi-attachment"></v-file-input>
    </div>
    <div class="mb-3">
      <date-picker compact-time auto-submit color="#5c6bc0"  type="datetime" label="انتخاب تاریخ و زمان" v-model="date" format="YYYY-MM-DD HH:mm" display-format="jYYYY-jMM-jDD HH:mm" />
    </div>

  </div>
</template>

<style scoped>

</style>