<script>
export default {
  name: "Index_Links"
}
</script>

<template>
  <div class="dashboard-cards">
    <v-row class="cards-container">
      <!-- Consultant Card -->
      <v-col cols="6" sm="6" md="6" lg="6" xl="6" class="card-col">
        <router-link :to="{name : 'customers_consultant'}" class="card-link">
          <v-card class="dashboard-card consultant-card" elevation="0">
            <div class="card-content">
              <div class="card-image-container">
                <img src="@/assets/images/icons/counseling.svg" class="card-image" alt="مشاوره">
              </div>
              <div class="card-info">
                <div class="card-header">
                  <h3 class="card-title">مشاوره</h3>
                </div>
                <p class="card-description">لیست شماره های در حال مشاوره</p>
              </div>
            </div>
          </v-card>
        </router-link>
      </v-col>

      <!-- Sales Card -->
      <v-col cols="6" sm="6" md="6" lg="6" xl="6" class="card-col">
        <router-link :to="{name : 'customers_seller'}" class="card-link">
          <v-card class="dashboard-card sales-card" elevation="0">
            <div class="card-content">
              <div class="card-image-container">
                <img src="@/assets/images/icons/sale-team.svg" class="card-image" alt="فروش">
              </div>
              <div class="card-info">
                <div class="card-header">
                  <h3 class="card-title">فروش</h3>
                </div>
                <p class="card-description">لیست شماره های در حال فروش</p>
              </div>
            </div>
          </v-card>
        </router-link>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
/* Dashboard Cards Container */
.dashboard-cards {
  margin-top: 24px;
  margin-bottom: 32px;
}

.cards-container {
  gap: 12px;
  display: flex !important;
  flex-wrap: nowrap !important;
}

.card-col {
  padding: 6px;
  flex: 0 0 50% !important;
  max-width: 50% !important;
}

/* Card Link */
.card-link {
  text-decoration: none;
  display: block;
  height: 100%;
}

/* Dashboard Card */
.dashboard-card {
  height: 120px;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.dashboard-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  border-color: rgba(0, 0, 0, 0.2);
}

.dashboard-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #2196f3, #21cbf3);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sales-card::before {
  background: linear-gradient(90deg, #ff9800, #ffb74d);
}

.dashboard-card:hover::before {
  opacity: 1;
}

/* Card Content */
.card-content {
  display: flex;
  height: 100%;
  position: relative;
}

/* Image Container */
.card-image-container {
  flex: 0 0 40%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(33, 150, 243, 0.02) 100%);
}

.sales-card .card-image-container {
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, rgba(255, 152, 0, 0.02) 100%);
}

.card-image {
  width: 100%;
  height: auto;
  max-height: 70px;
  object-fit: contain;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.dashboard-card:hover .card-image {
  transform: scale(1.1) rotate(2deg);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

/* Card Info */
.card-info {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  position: relative;
}


.card-header {
  margin-bottom: 8px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
  transition: color 0.3s ease;
}

.dashboard-card:hover .card-title {
  color: #2196f3;
}

.sales-card:hover .card-title {
  color: #ff9800;
}

.card-description {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.dashboard-card:hover .card-description {
  color: #555;
}

/* Mobile Responsive */
@media (max-width: 960px) {
  .cards-container {
    gap: 8px;
  }
  
  .card-col {
    padding: 4px;
  }
  
  .dashboard-card {
    height: 110px;
  }
  
  .card-info {
    padding: 14px;
  }
  
  .card-title {
    font-size: 16px;
  }
  
  .card-description {
    font-size: 12px;
  }
  
  .card-image-container {
    padding: 14px;
  }
  
  .card-image {
    max-height: 60px;
  }
}

@media (max-width: 600px) {
  .cards-container {
    gap: 6px;
  }
  
  .card-col {
    padding: 3px;
  }
  
  .dashboard-card {
    height: 100px;
  }
  
  .card-image-container {
    flex: 0 0 35%;
    padding: 10px;
  }
  
  .card-info {
    padding: 10px;
  }
  
  .card-title {
    font-size: 14px;
  }
  
  .card-description {
    font-size: 11px;
  }
  
  .card-image {
    max-height: 50px;
  }
  
  .card-header {
    margin-bottom: 4px;
  }
  
}

/* Animation */
.dashboard-card {
  animation: fadeInUp 0.4s ease forwards;
}

.dashboard-card:nth-child(1) {
  animation-delay: 0.1s;
}

.dashboard-card:nth-child(2) {
  animation-delay: 0.2s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>