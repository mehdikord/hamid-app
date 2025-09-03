<script>
import Activity_Card from "./Activity_Card.vue";

export default {
  name: "Index_Activity_List",
  components: {
    Activity_Card
  },
  data() {
    return {
      // Track which card is currently open (only one at a time)
      openCardId: null,
      // Mock data - will be replaced with actual API response in the future
      activities: {
        today: [
          {
            id: 1,
            time: "۱۰:۳۰",
            title: "تماس با مشتری X",
            description: "پروژه: نبی زاده",
            project: "نبی زاده"
          },
          {
            id: 2,
            time: "۱۴:۰۰",
            title: "ارسال پیش فاکتور",
            description: "پروژه: طراحی آنلاین",
            project: "طراحی آنلاین"
          }
        ],
        tomorrow: [
          {
            id: 3,
            time: "۱۱:۰۰",
            title: "پیگیری مشتری ۷",
            description: "پروژه: کمک مستری",
            project: "کمک مستری"
          }
        ]
      }
    }
  },
  methods: {
    // Method to fetch activities from projects API (future implementation)
    Get_Activities_Data() {
      // TODO: Replace with actual API call to projects
      // Stores_Projects().GetActivities().then(res => {
      //   this.activities = res.data.result;
      // }).catch(error => {
      //   console.error('Error loading activities data:', error);
      // })
    }
  },
  mounted() {
    this.Get_Activities_Data();
  }
}
</script>

<template>
  <div>
    <div class="text-center">
      <strong class="text-black-darken-1 font-15">لیست فعالیت ها</strong>
    </div>
    
    <!-- Today Section -->
    <div class="mt-6">
      <div class="text-right mb-3">
        <h3 class="text-black-darken-1 font-14 font-weight-medium">امروز</h3>
      </div>
      <div class="activities-container">
        <Activity_Card 
          v-for="activity in activities.today" 
          :key="activity.id"
          :activity="activity"
          v-model:openCardId="openCardId"
          class="mb-3"
        />
      </div>
    </div>

    <!-- Tomorrow Section -->
    <div class="mt-6">
      <div class="text-right mb-3">
        <h3 class="text-black-darken-1 font-14 font-weight-medium">فردا</h3>
      </div>
      <div class="activities-container">
        <Activity_Card 
          v-for="activity in activities.tomorrow" 
          :key="activity.id"
          :activity="activity"
          v-model:openCardId="openCardId"
          class="mb-3"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.activities-container {
  display: flex;
  flex-direction: column;
}

.activities-container .activity-card:last-child {
  margin-bottom: 0 !important;
}
</style>
