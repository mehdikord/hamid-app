<script>
export default {
  name: "Global_Chip_Date",
  props:['date']
}
</script>

<template>
  <v-chip density="comfortable" variant="outlined" color="indigo"  v-if="date">
    {{ this.$filters.date_jalali(date,'jYYYY/jM/jD') }}
  </v-chip>

</template>

<style scoped>

</style>