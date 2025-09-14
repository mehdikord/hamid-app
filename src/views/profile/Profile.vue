<script>
import profileBg from '@/assets/images/backgrounds/profile-bg.jpg';
import Profile from '@/assets/images/icons/profile.svg';
import {Stores_Profile} from "@/stores/profile/profile.js";

export default {
  name: "Profile",
  mounted() {
    this.Get_Profile();
  },
  data(){
    return {
      profileBg,
      Profile,
      loading:true,
      user : null,
    }
  },
  methods : {
   Get_Profile(){
     Stores_Profile().Profile().then(res => {
       this.user = res.data.result;
       this.loading = false;
     }).catch(error => {
       this.Notify_Error_Server('خطا در دریافت اطلاعات');
     });
   }

  }

}

</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-skeleton-loader v-if="loading"
          class="mx-auto"
          type="card-avatar,"
      ></v-skeleton-loader>
      <v-card v-else flat rounded="lg" class="profile-card" elevation="1">
        <!-- Profile Content -->
        <v-card-text class="profile-content">
          <div class="profile-main">
            <!-- Avatar -->
            <v-avatar class="profile-avatar" :image="Profile" size="80"></v-avatar>
            
            <!-- User Info -->
            <div class="profile-info">
              <h2 class="profile-name color-orange-text">{{ user.name }}</h2>
              <p class="profile-phone text-grey-darken-2">{{ user.phone }}</p>
            </div>
            
            <!-- Action Buttons -->
            <div class="profile-actions">
              <v-btn 
                variant="text" 
                color="error" 
                icon="mdi-logout"
                size="small"
                class="action-btn"
              ></v-btn>
              <v-btn 
                variant="text" 
                color="primary" 
                icon="mdi-pen"
                size="small"
                class="action-btn"
              ></v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.profile-card {
  transition: all 0.2s ease;
}

.profile-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.profile-content {
  padding: 24px !important;
}

.profile-main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-avatar {
  flex-shrink: 0;
  border: 2px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
  border-color: #ff5616;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.profile-phone {
  font-size: 0.9rem;
  margin: 0;
  font-weight: 400;
  opacity: 0.8;
}

.profile-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  min-width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

/* Responsive Design */
@media (max-width: 600px) {
  .profile-content {
    padding: 20px !important;
  }
  
  .profile-main {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .profile-info {
    order: 2;
  }
  
  .profile-actions {
    order: 3;
    justify-content: center;
  }
  
  .profile-name {
    font-size: 1.1rem;
  }
  
  .profile-phone {
    font-size: 0.85rem;
  }
}
</style>