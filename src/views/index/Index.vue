<template>
  <div class="dashboard-container">
    <!-- Project Selector -->
    <v-card flat border rounded class="mb-4">
      <v-card-item>
        <div class="mt-2">
          <v-select
            variant="outlined"
            rounded
            label="انتخاب پروژه"
            :items="projectOptions"
            v-model="selectedProjectId"
            item-title="name" 
            item-value="id"
            color="deep-orange-darken-2"
            density="comfortable"
            clearable
            @update:model-value="onProjectChange"
            @click:clear="Clear_Project"
          >
          </v-select>
        </div>
      </v-card-item>
    </v-card>

    <!-- Period Buttons -->
    <v-card flat border rounded class="mb-4">
      <v-card-item>
        <div class="period-buttons-container">
          <v-btn
            v-for="period in periodOptions"
            :key="period.value"
            :variant="selectedPeriod === period.value ? 'flat' : 'outlined'"
            :color="selectedPeriod === period.value ? 'deep-orange-darken-2' : 'grey'"
            size="default"
            rounded="lg"
            class="period-btn"
            @click="selectPeriod(period.value)"
          >
            {{ period.label }}
          </v-btn>
        </div>
        
        <!-- Custom Date Range (shown when انتخابی is selected) -->
        <div v-if="selectedPeriod === 'custom'" class="mt-4">
          <v-row>
            <v-col cols="12" md="6">
              <div class="custom-date-input-wrapper">
                <input
                  type="text"
                  class="custom-date-input-from"
                  :value="formattedFromDate"
                  placeholder="از تاریخ"
                  readonly
                />
                <label class="custom-date-label">از تاریخ</label>
                <i class="mdi mdi-calendar-range custom-date-icon"></i>
              </div>
              <date-picker  
                compact-time 
                auto-submit 
                color="#5c6bc0"  
                type="date" 
                v-model="customFromDate" 
                format="YYYY-MM-DD" 
                display-format="jYYYY-jMM-jDD"
                custom-input=".custom-date-input-from"
                @change="onCustomDateChange"
              />
            </v-col>
            <v-col cols="12" md="6">
              <div class="custom-date-input-wrapper">
                <input
                  type="text"
                  class="custom-date-input-to"
                  :value="formattedToDate"
                  placeholder="تا تاریخ"
                  readonly
                />
                <label class="custom-date-label">تا تاریخ</label>
                <i class="mdi mdi-calendar-range custom-date-icon"></i>
              </div>
              <date-picker  
                compact-time 
                auto-submit 
                color="#5c6bc0"  
                type="date" 
                v-model="customToDate" 
                format="YYYY-MM-DD" 
                display-format="jYYYY-jMM-jDD"
                custom-input=".custom-date-input-to"
                @change="onCustomDateChange"
              />
            </v-col>
          </v-row>
        </div>
      </v-card-item>
    </v-card>

    <!-- Chart -->
    <v-card flat border rounded class="mb-4">
      <v-card-item>
        <div>
          <v-icon icon="mdi mdi-chart-line" size="35" color="deep-orange-darken-2" class="me-2"></v-icon>
          <strong class="color-dark-text font-15">نمودار فروش</strong>
        </div>
        <div class="mt-4">
          <div v-if="chartLoading" class="text-center pa-8">
            <v-progress-circular indeterminate color="deep-orange-darken-2"></v-progress-circular>
            <p class="mt-4 text-medium-emphasis">در حال بارگذاری نمودار...</p>
          </div>
          <div v-else-if="chartData.length === 0" class="text-center pa-8">
            <p class="text-medium-emphasis">داده‌ای برای نمایش وجود ندارد</p>
          </div>
          <LineAreaChart v-else :chart-data="chartData" />
        </div>
      </v-card-item>
    </v-card>

    <!-- Last 3 Reports -->
    <v-card flat border rounded class="mb-4">
      <v-card-item>
        <div>
          <v-icon icon="mdi mdi-text-box" size="35" color="deep-orange-darken-2" class="me-2"></v-icon>
          <strong class="color-dark-text font-15">آخرین گزارشات</strong>
        </div>
        <div class="mt-4">
          <div v-if="reportsLoading" class="text-center pa-8">
            <v-progress-circular indeterminate color="deep-orange-darken-2"></v-progress-circular>
            <p class="mt-4 text-medium-emphasis">در حال بارگذاری...</p>
          </div>
          <div v-else-if="lastReports.length === 0" class="mt-6">
            <Global_No_Items />
          </div>
          <div v-else class="reports-list">
            <Report_Single 
              v-for="report in lastReports" 
              :key="report.id" 
              :report="report"
              class="mb-2"
            />
          </div>
        </div>
      </v-card-item>
    </v-card>

    <!-- Last 3 Invoices -->
    <v-card flat border rounded>
      <v-card-item>
        <div>
          <v-icon icon="mdi mdi-receipt" size="35" color="deep-orange-darken-2" class="me-2"></v-icon>
          <strong class="color-dark-text font-15">آخرین فاکتورها</strong>
        </div>
        <div class="mt-4">
          <div v-if="invoicesLoading" class="text-center pa-8">
            <v-progress-circular indeterminate color="deep-orange-darken-2"></v-progress-circular>
            <p class="mt-4 text-medium-emphasis">در حال بارگذاری...</p>
          </div>
          <div v-else-if="lastInvoices.length === 0" class="mt-6">
            <Global_No_Items />
          </div>
          <div v-else class="invoices-list">
            <Invoice_Single 
              v-for="invoice in lastInvoices" 
              :key="invoice.id" 
              :invoice="invoice"
              class="mb-2"
            />
          </div>
        </div>
      </v-card-item>
    </v-card>
  </div>
</template>

<script>
import { Stores_Projects } from "@/stores/projects/projects.js";
import { Stores_Reports } from "@/stores/reports/reports.js";
import { Stores_Invoices } from "@/stores/invoices/invoices.js";
import LineAreaChart from "@/components/charts/LineAreaChart.vue";
import Report_Single from "@/components/reports/Report_Single.vue";
import Invoice_Single from "@/components/invoices/Invoice_Single.vue";
import Global_No_Items from "@/components/global/Global_No_Items.vue";

export default {
  name: 'Index',
  components: {
    LineAreaChart,
    Report_Single,
    Invoice_Single,
    Global_No_Items
  },
  mounted() {
    this.Get_Projects();
    this.initializeDates();
    this.Get_Invoices_Data();
    this.Get_Last_Reports();
    this.Get_Last_Invoices();
  },
  data() {
    return {
      projects: [],
      selectedProjectId: null,
      selectedPeriod: 'weekly', // Default to weekly
      periodOptions: [
        { value: 'weekly', label: 'هفتگی' },
        { value: 'monthly', label: 'ماهانه' },
        { value: 'custom', label: 'انتخابی' }
      ],
      fromDate: null,
      toDate: null,
      customFromDate: null,
      customToDate: null,
      chartData: [],
      chartLoading: false,
      lastReports: [],
      reportsLoading: false,
      lastInvoices: [],
      invoicesLoading: false
    }
  },
  computed: {
    projectOptions() {
      const allOption = { id: null, name: 'همه پروژه‌ها' };
      return [allOption, ...this.projects];
    },
    formattedFromDate() {
      if (this.customFromDate) {
        return this.$filters.date_jalali(this.customFromDate, 'jYYYY/jM/jD');
      }
      return '';
    },
    formattedToDate() {
      if (this.customToDate) {
        return this.$filters.date_jalali(this.customToDate, 'jYYYY/jM/jD');
      }
      return '';
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
    initializeDates() {
      // Set default to one week ago
      const today = moment();
      this.toDate = today.format('YYYY-MM-DD');
      this.fromDate = today.clone().subtract(7, 'days').format('YYYY-MM-DD');
    },
    selectPeriod(period) {
      this.selectedPeriod = period;
      const today = moment();
      
      if (period === 'weekly') {
        this.fromDate = today.clone().subtract(7, 'days').format('YYYY-MM-DD');
        this.toDate = today.format('YYYY-MM-DD');
        this.customFromDate = null;
        this.customToDate = null;
      } else if (period === 'monthly') {
        this.fromDate = today.clone().subtract(1, 'months').format('YYYY-MM-DD');
        this.toDate = today.format('YYYY-MM-DD');
        this.customFromDate = null;
        this.customToDate = null;
      } else if (period === 'custom') {
        // Keep custom dates if they exist, otherwise use current dates
        if (!this.customFromDate) {
          this.customFromDate = this.fromDate;
        }
        if (!this.customToDate) {
          this.customToDate = this.toDate;
        }
      }
      
      this.Get_Invoices_Data();
    },
    onCustomDateChange() {
      if (this.customFromDate && this.customToDate) {
        this.fromDate = this.customFromDate;
        this.toDate = this.customToDate;
        this.Get_Invoices_Data();
      }
    },
    onProjectChange() {
      this.Get_Invoices_Data();
    },
    Clear_Project() {
      this.selectedProjectId = null;
      this.Get_Invoices_Data();
    },
    Get_Invoices_Data() {
      this.chartLoading = true;
      
      const params = {
        from_date: this.fromDate,
        to_date: this.toDate
      };
      
      if (this.selectedProjectId) {
        params.project_id = this.selectedProjectId;
      }
      
      Stores_Invoices().Chart_Data(params).then(res => {
        if (res.data && res.data.result) {
          this.chartData = res.data.result;
        } else {
          this.chartData = [];
        }
        this.chartLoading = false;
      }).catch(error => {
        console.error('Error loading invoices data:', error);
        this.chartData = [];
        this.chartLoading = false;
      })
    },
    Get_Last_Reports() {
      this.reportsLoading = true;
      
      // Fetch last 3 reports from all projects (no date filter, but we can add per_page=3)
      const params = {
        per_page: 3,
        page: 1,
        sort_by: 'id',
        sort_type: 'desc'
      };
      
      Stores_Reports().Index(params).then(res => {
        if (res.data && res.data.result) {
          this.lastReports = res.data.result.data || [];
        } else {
          this.lastReports = [];
        }
        this.reportsLoading = false;
      }).catch(error => {
        console.error('Error loading last reports:', error);
        this.lastReports = [];
        this.reportsLoading = false;
      })
    },
    Get_Last_Invoices() {
      this.invoicesLoading = true;
      
      // Fetch last 3 invoices from all projects (no date filter, but we can add per_page=3)
      const params = {
        per_page: 3,
        page: 1
      };
      
      Stores_Invoices().Index(params).then(res => {
        if (res.data && res.data.result) {
          this.lastInvoices = res.data.result.data || [];
        } else {
          this.lastInvoices = [];
        }
        this.invoicesLoading = false;
      }).catch(error => {
        console.error('Error loading last invoices:', error);
        this.lastInvoices = [];
        this.invoicesLoading = false;
      })
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 0 16px;
}

.color-dark-text {
  color: #333;
}

.period-buttons-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.period-btn {
  flex: 1;
  min-width: 120px;
}

.reports-list,
.invoices-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}


/* Custom Date Input Styling */
.custom-date-input-wrapper {
  position: relative;
  width: 100%;
}

.custom-date-input-from,
.custom-date-input-to {
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
  border: 1px solid rgba(0, 0, 0, 0.38);
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.custom-date-input-from:focus,
.custom-date-input-to:focus {
  outline: none;
  border-color: #5c6bc0;
  border-width: 2px;
}

.custom-date-label {
  position: absolute;
  right: 12px;
  top: -8px;
  background: white;
  padding: 0 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  pointer-events: none;
}

.custom-date-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(0, 0, 0, 0.54);
  pointer-events: none;
}

/* Mobile responsive */
@media (max-width: 960px) {
  .dashboard-container {
    padding: 0 12px;
  }
  
  .period-buttons-container {
    gap: 8px;
  }
  
  .period-btn {
    min-width: 100px;
    font-size: 13px;
  }
}

@media (max-width: 600px) {
  .dashboard-container {
    padding: 0 8px;
  }
  
  .period-btn {
    min-width: 80px;
    font-size: 12px;
    padding: 8px 12px;
  }
  
  .custom-date-input-from,
  .custom-date-input-to {
    padding: 10px 14px;
    padding-right: 36px;
    font-size: 13px;
  }
  
  .custom-date-label {
    font-size: 11px;
    right: 10px;
  }
  
  .custom-date-icon {
    left: 10px;
    font-size: 18px;
  }
}
</style>
