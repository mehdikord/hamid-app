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
      show_items:[15,25,50,100,200],
      pagination: this.data,
    }
  },
  methods:{
    Change_PerPage(){
      this.$emit('PerPageChange',this.pagination.per_page);
    },
    Change_Page(){
      this.$emit('ChangePage',this.pagination.current);
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
            v-model="pagination.per_page"
            color="deep-orange-darken-2"
            label="تعداد داده در صفحه"
            variant="outlined"
            density="comfortable"
            @update:model-value="Change_PerPage"
        >
        </v-select>
      </v-col>
      <v-col cols="8">
        <v-pagination
            class="float-start"
            active-color="deep-orange-darken-3"
            :length="pagination.last_page"
            density="comfortable"
            variant="text"
            :total-visible="10"
            rounded="rounded"
            v-model="pagination.current"
            @update:model-value="Change_Page"
        ></v-pagination>
      </v-col>
    </v-row>
  </div>

</template>

<style scoped>

</style>