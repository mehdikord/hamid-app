<script>
export default {
  name : "Global_Chip_Customer_Level",
  props:{
    customer:Object,
    required:true
  },

}
</script>

<template>
  <template v-if="customer">
    <v-chip v-if="!customer.level" variant="flat" color="grey-darken-2" size="small" class="font-13 mt-2" rounded>بدون مرحله</v-chip>
    <v-chip v-else variant="flat" :style="{'backgroundColor' : customer.level.color,'color' : 'white' }" size="small" class="font-13 mt-2" rounded>{{ customer.level.name }}</v-chip>
  </template>
</template>

<style scoped>

</style>