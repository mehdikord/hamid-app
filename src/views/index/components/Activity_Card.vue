<script>
export default {
  name: "Activity_Card",
  props: {
    activity: {
      type: Object,
      required: true
    },
    // Add prop to track which card is currently open
    openCardId: {
      type: [String, Number],
      default: null
    }
  },
  emits: ['update:openCardId'],
  data() {
    return {
      showMenu: false,
      completing: false,
      isMobile: false
    }
  },
  computed: {
    // Check if this card is currently open
    isSelected() {
      return this.openCardId === this.activity.id;
    }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    
    // Add click outside listener for mobile
    if (this.isMobile) {
      document.addEventListener('click', this.handleClickOutside);
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
    document.removeEventListener('click', this.handleClickOutside);
  },
  watch: {
    isMobile(newVal) {
      if (newVal) {
        document.addEventListener('click', this.handleClickOutside);
      } else {
        document.removeEventListener('click', this.handleClickOutside);
      }
    }
  },
  methods: {
    // Mobile Detection
    checkMobile() {
      this.isMobile = window.innerWidth < 768;
    },
    
    // Handle click outside to close card
    handleClickOutside(event) {
      if (!this.isMobile || !this.isSelected) return;
      
      const cardElement = this.$el;
      const actionsElement = cardElement.querySelector('.mobile-actions-row');
      
      // Check if click is outside the card and actions
      if (!cardElement.contains(event.target)) {
        this.closeCard();
      }
    },
    
    // Card Selection for Mobile
    selectCard() {
      if (this.isMobile) {
        if (this.isSelected) {
          // If already selected, close it
          this.closeCard();
        } else {
          // Open this card (will close any other open card)
          this.$emit('update:openCardId', this.activity.id);
        }
      }
    },
    
    // Close the card
    closeCard() {
      this.$emit('update:openCardId', null);
    },
    
    // Desktop Actions
    editTask() {
      // TODO: Implement edit functionality
      console.log('Edit task:', this.activity.id);
      this.showMenu = false;
    },
    deleteTask() {
      // TODO: Implement delete functionality
      console.log('Delete task:', this.activity.id);
      this.showMenu = false;
    },
    async completeTask() {
      this.completing = true;
      try {
        // TODO: Implement complete functionality
        console.log('Complete task:', this.activity.id);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      } finally {
        this.completing = false;
      }
    },
    
    // Mobile Actions
    editTaskMobile() {
      this.editTask();
      this.closeCard();
    },
    
    deleteTaskMobile() {
      this.deleteTask();
      this.closeCard();
    },
    
    async completeTaskMobile() {
      await this.completeTask();
      this.closeCard();
    },
    
    // Priority and Status Methods
    getPriorityColor(priority) {
      const colors = {
        high: 'error',
        medium: 'warning',
        low: 'success',
        urgent: 'error'
      };
      return colors[priority] || 'grey';
    },
    
    getPriorityText(priority) {
      const texts = {
        high: 'عادی',
        medium: 'متوسط',
        low: 'کم',
        urgent: 'فوری'
      };
      return texts[priority] || priority;
    },
    
    getStatusColor(status) {
      const colors = {
        pending: 'warning',
        in_progress: 'info',
        completed: 'success',
        overdue: 'error'
      };
      return colors[status] || 'grey';
    },
    
    // Time and Due Date Methods
    getTimeIcon(dueTime) {
      if (!dueTime) return 'mdi-clock-outline';
      
      const now = new Date();
      const due = new Date(dueTime);
      const diffHours = (due - now) / (1000 * 60 * 60);
      
      if (diffHours < 0) return 'mdi-clock-alert'; // Overdue
      if (diffHours < 24) return 'mdi-clock-fast'; // Due soon
      return 'mdi-clock-outline'; // Due later
    },
    
    getTimeColor(dueTime) {
      if (!dueTime) return 'grey';
      
      const now = new Date();
      const due = new Date(dueTime);
      const diffHours = (due - now) / (1000 * 60 * 60);
      
      if (diffHours < 0) return 'error'; // Overdue
      if (diffHours < 24) return 'warning'; // Due soon
      return 'success'; // Due later
    },
    
    getTimeTextClass(dueTime) {
      if (!dueTime) return 'text-grey-darken-1';
      
      const now = new Date();
      const due = new Date(dueTime);
      const diffHours = (due - now) / (1000 * 60 * 60);
      
      if (diffHours < 0) return 'text-error';
      if (diffHours < 24) return 'text-warning';
      return 'text-success';
    },
    
    formatDueTime(dueTime) {
      if (!dueTime) return 'بدون تاریخ';
      
      const now = new Date();
      const due = new Date(dueTime);
      const diffHours = (due - now) / (1000 * 60 * 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffHours < 0) {
        const overdueHours = Math.abs(Math.floor(diffHours));
        if (overdueHours < 24) return `${overdueHours} ساعت تاخیر`;
        return `${Math.abs(diffDays)} روز تاخیر`;
      }
      
      if (diffHours < 24) {
        if (diffHours < 1) return 'در کمتر از 1 ساعت';
        return `در ${Math.floor(diffHours)} ساعت`;
      }
      
      if (diffDays === 1) return 'فردا';
      if (diffDays < 7) return `در ${diffDays} روز`;
      return due.toLocaleDateString('fa-IR');
    }
  }
}
</script>

<template>
  <div>
    <!-- Desktop Version -->
    <v-card 
      v-if="!isMobile"
      class="activity-card pa-4"
      elevation="2"
      rounded="lg"
      border
      color="white"
      hover
    >
      <!-- Main Content -->
      <div class="d-flex align-center justify-space-between">
        <!-- Activity Details (Right side for RTL) -->
        <div class="flex-grow-1 text-right">
          <h4 class="text-black-darken-1 font-weight-bold mb-2 font-15">
            {{ activity.title }}
          </h4>
          <p class="text-black-darken-2 mb-0 font-13">
            {{ activity.description }}
          </p>
        </div>
        
        <!-- Time and Actions (Left side for RTL) -->
        <div class="d-flex align-center">
          <!-- Complete Button -->
          <v-btn
            color="success"
            size="small"
            variant="elevated"
            class="mr-3 complete-btn"
            @click="completeTask"
            elevation="2"
            :loading="completing"
          >
            <v-icon icon="mdi-check" size="16" class="mr-1"></v-icon>
            تکمیل
          </v-btn>
          
          <!-- Time Badge -->
          <div class="time-badge pa-2 rounded-lg mr-3">
            <span class="text-black-darken-1 font-weight-bold font-14">
              {{ activity.time }}
            </span>
          </div>
          
          <!-- 3-dot Menu -->
          <v-menu
            v-model="showMenu"
            :close-on-content-click="true"
            location="bottom end"
            min-width="140"
            offset="8"
            transition="scale-transition"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                icon="mdi-dots-horizontal"
                size="small"
                variant="text"
                v-bind="props"
                class="menu-trigger"
              />
            </template>
            
            <v-list class="py-0">
              <v-list-item
                @click="editTask"
                class="px-4 py-2"
                hover
                density="compact"
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-pencil" size="16" color="primary"></v-icon>
                </template>
                <v-list-item-title class="text-right">
                  ویرایش
                </v-list-item-title>
              </v-list-item>
              
              <v-divider></v-divider>
              
              <v-list-item
                @click="deleteTask"
                class="px-4 py-2"
                hover
                density="compact"
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-delete" size="16" color="error"></v-icon>
                </template>
                <v-list-item-title class="text-right text-error">
                  حذف تسک
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </v-card>

    <!-- Mobile Version -->
    <v-card 
      v-else
      class="activity-card-mobile pa-3"
      :class="{ 'selected': isSelected }"
      elevation="1"
      rounded="lg"
      border
      color="white"
      @click="selectCard"
    >
      <div class="d-flex align-center justify-space-between">
        <!-- Content -->
        <div class="flex-grow-1 text-right">
          <h4 class="text-black-darken-1 font-weight-bold mb-1 font-15">
            {{ activity.title }}
          </h4>
          <p class="text-black-darken-2 mb-0 font-13 line-clamp-2">
            {{ activity.description }}
          </p>
        </div>
        
        <!-- Time Only -->
        <div class="time-mobile ml-3">
          <span class="text-grey-darken-1 font-weight-medium font-13">
            {{ activity.time }}
          </span>
        </div>
      </div>
    </v-card>

    <!-- Mobile Actions Row (Smooth slide animation) -->
    <div 
      v-if="isMobile && isSelected" 
      class="mobile-actions-row"
    >
      <div class="actions-container actions-visible">
        <!-- Complete Button -->
        <div class="action-section">
          <v-btn
            color="success"
            size="small"
            variant="elevated"
            class="action-btn-circle complete-btn"
            @click.stop="completeTaskMobile"
            :loading="completing"
            icon
          >
            <v-icon icon="mdi-check" size="18"></v-icon>
          </v-btn>
        </div>
        
        <!-- Edit Button -->
        <div class="action-section">
          <v-btn
            color="primary"
            size="small"
            variant="outlined"
            class="action-btn-circle edit-btn"
            @click.stop="editTaskMobile"
            icon
          >
            <v-icon icon="mdi-pencil" size="18"></v-icon>
          </v-btn>
        </div>
        
        <!-- Delete Button -->
        <div class="action-section">
          <v-btn
            color="error"
            size="small"
            variant="outlined"
            class="action-btn-circle delete-btn"
            @click.stop="deleteTaskMobile"
            icon
          >
            <v-icon icon="mdi-delete" size="18"></v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
  border-radius: 12px !important;
}

.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12) !important;
}

.activity-card-mobile {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
  border-radius: 12px !important;
}

.activity-card-mobile:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12) !important;
}

.activity-card-mobile.selected {
  border: 2px solid #1976d2 !important;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.2) !important;
  transform: translateY(-2px);
}

.complete-btn {
  transition: all 0.2s ease;
}

.complete-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3) !important;
}

.menu-trigger {
  color: rgba(0, 0, 0, 0.6);
}

.menu-trigger:hover {
  color: rgba(0, 0, 0, 0.8);
}

.time-mobile {
  min-width: 50px;
  text-align: center;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mobile-actions-row {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-top: none;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-top: -1px;
  overflow: hidden;
}

/* Smooth slide animation for actions */
.actions-container {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
}

.actions-container.actions-visible {
  max-height: 100px;
  opacity: 1;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease 0.1s;
}

/* Simple button styling */
.action-btn {
  transition: all 0.1s ease;
  min-height: 36px;
}

.actions-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
}

.action-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn-circle {
  border-radius: 50% !important;
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  min-height: 40px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.2s ease;
}

.action-btn-circle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
}

.action-btn-circle.complete-btn:hover {
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3) !important;
}

.action-btn-circle.edit-btn:hover {
  box-shadow: 0 4px 16px rgba(66, 133, 244, 0.3) !important;
}

.action-btn-circle.delete-btn:hover {
  box-shadow: 0 4px 16px rgba(211, 47, 47, 0.3) !important;
}


</style>
