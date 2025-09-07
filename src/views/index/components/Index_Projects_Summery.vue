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
        rounded
        label="انتخاب پروژه"
        :items="projects"
        v-model="selected_project"
        item-title="name"
        item-value="id"
        color="deep-orange-darken-2"
    >
    </v-select>
  </div>

</template>

<style scoped>

</style>