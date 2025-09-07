<script>
import { Stores_Projects } from "@/stores/projects/projects.js";

export default {
  name: "Index_Status_Summary",
  mounted() {
    this.Get_Projects_Data();
  },
  data() {
    return {
      // Only dynamic data will be stored here when needed
    }
  },
  methods: {
    Get_Projects_Data() {
      Stores_Projects().All().then(res => {
        // Here you can update the counts based on projects data if needed
        console.log('Projects data loaded:', res.data.result);
      }).catch(error => {
        console.error('Error loading projects data:', error);
      })
    }
  }
}
</script>

<template>
  <div>
    <!-- Section Title -->
    <div class="section-title-container">
      <h2 class="section-title">تفکیک وضعیت شماره ها</h2>
    </div>
    
    <v-row>
        <!-- Card 1: In Consultation -->
        <v-col cols="6" sm="6" md="3">
          <v-card 
            class="pa-4 h-100 d-flex flex-column justify-space-between"
            elevation="0"
            rounded="lg"
            border
          >
            <div class="d-flex justify-start mb-3">
              <v-icon 
                icon="mdi-face-agent"
                size="48"
                color="light-blue-darken-3"
              />
            </div>
            <div class="flex-grow-1 d-flex flex-column justify-center align-start">
              <p class="font-16 font-weight-bold mb-2 text-black">
                در حال مشاوره
              </p>
              <h3 class="font-24 font-weight-bold text-black">
                ۲۰
              </h3>
            </div>
          </v-card>
        </v-col>

        <!-- Card 2: Waiting for Deposit -->
        <v-col cols="6" sm="6" md="3">
          <v-card 
            class="pa-4 h-100 d-flex flex-column justify-space-between"
            elevation="0"
            rounded="lg"
            border
          >
            <div class="d-flex justify-start mb-3">
              <v-icon 
                icon="mdi-timer-sand-empty"
                size="48"
                color="amber-darken-1"
              />
            </div>
            <div class="flex-grow-1 d-flex flex-column justify-center align-start">
              <p class="font-16 font-weight-bold mb-2 text-black">
                در انتظار واریز
              </p>
              <h3 class="font-24 font-weight-bold text-black">
                ۱۰
              </h3>
            </div>
          </v-card>
        </v-col>

        <!-- Card 3: Special Number -->
        <v-col cols="6" sm="6" md="3">
          <v-card 
            class="pa-4 h-100 d-flex flex-column justify-space-between"
            elevation="0"
            rounded="lg"
            border
          >
            <div class="d-flex justify-start mb-3">
              <v-icon 
                icon="mdi-star"
                size="48"
                color="green-darken-2"
              />
            </div>
            <div class="flex-grow-1 d-flex flex-column justify-center align-start">
              <p class="font-16 font-weight-bold mb-2 text-black">
                شماره خاص
              </p>
              <h3 class="font-24 font-weight-bold text-black">
                ۷۰
              </h3>
            </div>
          </v-card>
        </v-col>

        <!-- Card 4: Unsuccessful -->
        <v-col cols="6" sm="6" md="3">
          <v-card 
            class="pa-4 h-100 d-flex flex-column justify-space-between"
            elevation="0"
            rounded="lg"
            border
          >
            <div class="d-flex justify-start mb-3">
              <v-icon 
                icon="mdi-close-circle"
                size="48"
                color="deep-orange-darken-3"
              />
            </div>
            <div class="flex-grow-1 d-flex flex-column justify-center align-start">
              <p class="font-16 font-weight-bold mb-2 text-black">
                ناموفق
              </p>
              <h3 class="font-24 font-weight-bold text-black">
                ۳۰
              </h3>
            </div>
          </v-card>
        </v-col>
      </v-row>
  </div>
</template>

<style scoped>
.section-title-container {
  text-align: center;
  margin-bottom: 24px;
  padding: 16px 0;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1976d2;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #1976d2, #42a5f5);
  border-radius: 2px;
}

/* Mobile responsive */
@media (max-width: 960px) {
  .section-title {
    font-size: 20px;
  }
  
  .section-title-container {
    margin-bottom: 20px;
    padding: 12px 0;
  }
}

@media (max-width: 600px) {
  .section-title {
    font-size: 18px;
  }
  
  .section-title-container {
    margin-bottom: 16px;
    padding: 10px 0;
  }
  
  .section-title::after {
    width: 40px;
    height: 2px;
  }
}
</style>
