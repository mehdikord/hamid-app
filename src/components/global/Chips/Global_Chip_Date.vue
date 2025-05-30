<script>
export default {
  name: "Global_Chip_Date",
  props: {
    date:{
      type:String,
      default:""
    },
    format:{
      type:String,
      default:"jYYYY/jM/jD"
    }
  }
}
</script>

<template>
  <v-chip density="comfortable" variant="outlined" color="indigo" class="font-11" v-if="date">
    {{ this.$filters.date_jalali(date,format) }}
  </v-chip>

</template>

<style scoped>

</style>