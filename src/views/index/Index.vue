<script >
import Index_Links from "@/views/index/components/Index_Links.vue";
import Index_Projects_Summery from "@/views/index/components/Index_Projects_Summery.vue";
import Index_Status_Summary from "@/views/index/components/Index_Status_Summary.vue";
import Index_Activity_List from "@/views/index/components/Index_Activity_List.vue";

export default {
  name : "Index",
  components : {
    'links' : Index_Links,
    'projects' : Index_Projects_Summery,
    'status-summary' : Index_Status_Summary,
    'activity-list' : Index_Activity_List,
  }

}

</script>

<template>
  <links></links>
  <div class="mt-8"></div>
  <projects></projects>
  <status-summary></status-summary>
  <div class="mt-8"></div>
  <activity-list></activity-list>
  <div class="mt-8"></div>
</template>

<style scoped>

</style>