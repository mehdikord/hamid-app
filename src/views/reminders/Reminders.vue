<template>
  <div class="reminders-page">
    <div class="page-header">
      <h1 class="page-title">یاداور ها</h1>
      <p class="page-subtitle">مدیریت یاداورها و اعلان‌ها</p>
    </div>
    
    <div class="empty-state">
      <div class="empty-icon">
        <v-icon size="80" color="grey-lighten-1">mdi-bell-outline</v-icon>
      </div>
      <h3 class="empty-title">هنوز یاداوری اضافه نشده</h3>
      <p class="empty-description">یاداورهای خود را اینجا مدیریت کنید</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reminders',
  data() {
    return {
      // Component data will be added later
    }
  },
  methods: {
    // Methods will be added later
  }
}
</script>

<style scoped>
.reminders-page {
  padding: 20px;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  margin-bottom: 20px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.empty-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}
</style>
