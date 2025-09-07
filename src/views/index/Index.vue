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
  <div class="index-container">
    <links></links>
    
    <div class="section-spacing"></div>
    <projects></projects>
    
    <div class="section-spacing"></div>
    <status-summary></status-summary>
    
    <div class="section-spacing"></div>
    <activity-list></activity-list>
  </div>
</template>

<style scoped>
.index-container {
  padding: 0 16px;
}

.section-spacing {
  height: 32px;
}

/* Mobile responsive spacing */
@media (max-width: 960px) {
  .index-container {
    padding: 0 12px;
  }
  
  .section-spacing {
    height: 24px;
  }
}

@media (max-width: 600px) {
  .index-container {
    padding: 0 8px;
  }
  
  .section-spacing {
    height: 20px;
  }
}
</style>