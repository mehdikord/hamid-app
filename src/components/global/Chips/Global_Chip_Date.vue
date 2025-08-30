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
    },
    color : {
      default:'indigo'
    }
  }
}
</script>

<template>
  <v-chip density="comfortable" variant="tonal" :color="color" class="font-11 font-weight-600" v-if="date">
    {{ this.$filters.date_jalali(date,format) }}
  </v-chip>

</template>

<style scoped>

</style>