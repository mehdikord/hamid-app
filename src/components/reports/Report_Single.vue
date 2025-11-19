<script>
export default {
  name: "Report_Single",
  props:['report'],
  data() {
    return {
      expanded: []
    }
  },
  computed: {
    projectName() {
      if (!this.report) return null;
      // Handle different data structures
      if (this.report.project_customer?.project?.name) {
        return this.report.project_customer.project.name;
      } else if (this.report.project?.name) {
        return this.report.project.name;
      }
      return null;
    }
  }
}
</script>

<template>
  <v-expansion-panels 
    v-if="report" 
    v-model="expanded"
    variant="accordion"
    class="report-accordion"
  >
    <v-expansion-panel>
      <v-expansion-panel-title class="compact-panel-title">
        <div class="compact-row">
          <div class="compact-cell date-cell">
            <v-icon icon="mdi-text-box-edit" size="18" color="teal" class="me-2"></v-icon>
            <span class="date-text">{{ this.$filters.date_jalali(report.created_at, 'jYYYY/jM/jD') }}</span>
          </div>
          <div class="compact-cell text-cell">
            <span class="text-content">{{ this.Helper_Text_Shorter(report.report, 60) }}</span>
          </div>
          <div class="compact-cell project-cell" v-if="projectName">
            <v-icon icon="mdi-folder-outline" size="16" color="indigo" class="me-1"></v-icon>
            <span class="project-text">{{ projectName }}</span>
          </div>
          <div class="compact-cell user-cell" v-if="report.user?.name">
            <span class="user-text">{{ report.user.name }}</span>
          </div>
          <v-chip 
            color="teal" 
            size="x-small"
            variant="flat"
            class="chip-cell"
          >
            گزارش
          </v-chip>
        </div>
      </v-expansion-panel-title>
      <v-expansion-panel-text class="compact-panel-text">
        <div class="expanded-content">
          <v-divider class="mb-2"></v-divider>
          <div class="detail-item" v-if="report.report">
            <strong class="detail-label">متن کامل:</strong>
            <p class="detail-value">{{ report.report }}</p>
          </div>
          <div class="detail-item" v-if="report.file_url">
            <strong class="detail-label">پیوست:</strong>
            <v-btn 
              @click.stop="Helper_Downloader(report.file_url, report.file_name)"
              variant="text" 
              color="teal" 
              size="small"
              prepend-icon="mdi-download"
            >
              {{ report.file_name }}
            </v-btn>
          </div>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>
.report-accordion {
  margin-bottom: 8px;
}

.report-accordion :deep(.v-expansion-panel) {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
}

.report-accordion :deep(.v-expansion-panel-title) {
  min-height: 48px !important;
  padding: 8px 12px !important;
}

.compact-row {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
  flex-wrap: wrap;
}

.compact-cell {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.date-cell {
  min-width: 120px;
  font-weight: 600;
  color: #00796b;
}

.text-cell {
  flex: 1;
  min-width: 200px;
  color: #333;
}

.project-cell {
  min-width: 150px;
  color: #5c6bc0;
}

.user-cell {
  min-width: 100px;
  color: #666;
  font-size: 0.875rem;
}

.chip-cell {
  margin-right: auto;
}

.date-text,
.text-content,
.project-text,
.user-text {
  font-size: 0.875rem;
  line-height: 1.4;
}

.compact-panel-text {
  padding: 12px !important;
}

.expanded-content {
  padding-top: 8px;
}

.detail-item {
  margin-bottom: 12px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  display: block;
  margin-bottom: 4px;
  color: #666;
  font-size: 0.875rem;
}

.detail-value {
  margin: 0;
  color: #333;
  font-size: 0.875rem;
  line-height: 1.6;
}

/* Mobile responsive */
@media (max-width: 960px) {
  .compact-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .compact-cell {
    width: 100%;
  }
  
  .date-cell,
  .text-cell,
  .project-cell,
  .user-cell {
    min-width: auto;
  }
  
  .chip-cell {
    margin-right: 0;
    margin-top: 4px;
  }
}

/* Desktop compact view */
@media (min-width: 960px) {
  .report-accordion :deep(.v-expansion-panel-title) {
    min-height: 40px !important;
    padding: 6px 10px !important;
  }
  
  .date-text,
  .text-content,
  .project-text,
  .user-text {
    font-size: 0.8125rem;
  }
  
  .compact-row {
    gap: 8px;
  }
  
  .text-cell {
    min-width: 250px;
  }
}
</style>
