<script>
export default {
  name: "Action_Data_Table_Pagination",
  props:{
    data:{
      type:Object,
      required:true
    }
  },
  data(){
    return {
      show_items:[15,20,30,50,100]
    }
  }
}
</script>

<template>

  <div v-if="pagination">
    <v-row>
      <v-col cols="4">
        <v-select
            :items="show_items"
            rounded
            color="deep-orange-darken-2"
            label="تعداد داده در صفحه"
            variant="outlined"
            density="comfortable"
            clearable
        >
        </v-select>
      </v-col>
      <v-col cols="80">
        <v-pagination
            class="float-start"
            active-color="deep-orange-darken-3"
            :length="50"
            density="comfortable"
            variant="text"
            :total-visible="10"
            rounded="rounded"
        ></v-pagination>
      </v-col>
    </v-row>
  </div>

</template>

<style scoped>

</style>