<script>
export default {
  name: "Report_Single",
  props:['report'],

}
</script>

<template>

  <v-card v-if="report" hover variant="outlined" color="blue-grey-lighten-3" class="rounded">
    <v-card-item class="text-black pa-3">
      <div class="mb-4">
        <chips_user :user="report.user"></chips_user>
        <chips_date class="float-left" :date="report.created_at"></chips_date>
      </div>
      <p class="text-justify font-15">
        {{ report.report }}
      </p>
      <div v-if="report.file_url">

      </div>
      <div class="mt-4">
        <span class="text-grey-darken-2">پروژه : </span>
        <strong class="text-indigo">{{ report.project_customer.project.name }}</strong>
      </div>
    </v-card-item>
  </v-card>

</template>

<style scoped>

</style>