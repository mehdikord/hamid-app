<script >

import {Stores_Projects} from "@/stores/projects/projects.js";

export default {
  name: "Index_Projects_Summery",
  mounted() {
    this.Get_Projects();
  },
  data(){
    return{
      projects : [],
      selected_project : null,

    }
  },
  methods : {
    Get_Projects(){
      Stores_Projects().All().then(res =>{
        this.projects = res.data.result;
      }).catch(error =>{

      })
    },
  }
}
</script>

<template>
  <div>
    <v-select
        variant="outlined"
        rounded="lg"
        label="انتخاب پروژه"
        :items="projects"
        v-model="selected_project"
        item-title="name"
        item-value="id"
        color="deep-orange-darken-2"
        class="custom-select"
    >
    </v-select>
  </div>

</template>

<style scoped>
.custom-select {
  border-radius: 12px !important;
}

.custom-select :deep(.v-field) {
  border-radius: 12px !important;
}

.custom-select :deep(.v-field__outline) {
  border-radius: 12px !important;
}
</style>