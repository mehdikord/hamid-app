<script >
import Index_Links from "@/views/index/components/Index_Links.vue";
import Index_Projects_Summery from "@/views/index/components/Index_Projects_Summery.vue";

export default {
  name : "Index",
  components : {
    'links' : Index_Links,
    'projects' : Index_Projects_Summery,
  }

}

</script>

<template>
  <links></links>
  <div class="mt-8"></div>
  <projects></projects>


</template>

<style scoped>

</style>