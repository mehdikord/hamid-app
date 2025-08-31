<template>
  <v-card flat border rounded>
    <v-card-item>
      <div>
        <v-icon icon="mdi mdi-chart-box" size="35" color="deep-orange-darken-2" class="me-2"></v-icon>
        <strong class="color-dark-text font-15">گزارش مالی</strong>
      </div>
      <div class="mt-4">
        <v-select
            variant="outlined"
            rounded
            label="انتخاب پروژه"
            :items="projects"
            v-model="selected_project"
            item-title="name" 
            item-value="id"
            color="deep-orange-darken-2"
            density="comfortable"
        >
        </v-select>
      </div>
    </v-card-item>
  </v-card>
  <div class="mt-6">
        <h3 class="color-dark-text font-15 mb-4">نمودار فروش</h3>
        <LineAreaChart />
      </div>
</template>

<script>
import {Stores_Projects} from "@/stores/projects/projects.js";
import LineAreaChart from "@/components/charts/LineAreaChart.vue";

export default {
  name: 'Reports',
  components: {
    LineAreaChart
  },
  mounted() {
    this.Get_Projects();
  },
  data() {
    return {
      projects: [],
      selected_project: null,
    }
  },
  methods: {
    Get_Projects() {
      Stores_Projects().All().then(res => {
        this.projects = res.data.result;
      }).catch(error => {
        console.error('Error loading projects data:', error);
      })
    },
  }
}
</script>

<style scoped>
.color-dark-text {
  color: #333;
}
</style>
