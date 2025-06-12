<script>
export default {
  name : "Global_Chip_Customer_Status",
  props:{
    customer:Object,
    required:true
  },

}
</script>

<template>
  <template v-if="customer">
    <v-chip v-if="!customer.status" variant="flat" color="grey-darken-2" size="small" class="font-13 mt-2" rounded>بدون وضعیت</v-chip>
    <v-chip v-else variant="flat" :style="{'backgroundColor' : customer.status.color,'color' : 'white' }" size="small" class="font-13 mt-2" rounded>{{ customer.status.name }}</v-chip>
  </template>
</template>

<style scoped>

</style>