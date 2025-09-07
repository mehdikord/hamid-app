<script>
import {Stores_Customer} from "@/stores/customers/customers.js";

export default {
  name: "Customer_Profile_Summery",
  mounted() {
    this.Get_Repots();
    this.Get_Invoices();
  },
  props:{
    customer:{
      type:Object,
      required:true
    }
  },
  data(){
    return {
      params:{
        id : this.customer.id
      },
      loading_reports:true,
      loading_invoices:false,
      reports:[],
      invoices:[],
    }
  },
  methods:{

    Get_Repots(){
      Stores_Customer().Reports_Latest(this.params).then(res => {
        this.reports = res.data.result;
        this.loading_reports = false;
      }).catch(error => {
        this.Notify_Error_Server();


      })

    },
    Get_Invoices(){
      Stores_Customer().Invoices_Latest(this.params).then(res => {
        this.invoices = res.data.result;
        this.loading_invoices = false;
      }).catch(error => {
        this.Notify_Error_Server();
      })

    },



  }
}
</script>

<template>
  <template v-if="customer">
    <!-- Section Header -->
    <div class="section-header">
      <h2 class="section-title">خلاصه اطلاعات مشتری</h2>
    </div>

    <!-- Reports Section -->
    <div class="summary-section">
      <div class="section-subheader">
        <v-icon icon="mdi-text-box-edit-outline" color="teal-darken-2" size="24" class="me-2"></v-icon>
        <h3 class="section-subtitle">گزارشات ثبت شده برای مشتری (5 گزارش آخر)</h3>
      </div>
      <div class="section-content">
        <template v-if="loading_reports">
          <v-skeleton-loader
              v-for="i in 5"
              class="mx-auto mb-4"
              elevation="0"
              type="article,actions"

          ></v-skeleton-loader>

        </template>
        <template v-else>
          <template v-if="reports.length">
            <div v-for="report in reports" :key="report.id" class="animate__animated animate__zoomInDown">
              <report_single class="mb-4" :report="report"></report_single>
            </div>
          </template>
          <template v-else>
            <div class="empty-state">
              <v-alert
                  border="top"
                  color="teal-darken-2"
                  variant="tonal"
                  prominent
              >
                <strong>
                  هنوز هیچ گزارشی برای این مشتری ثبت نگردیده است !
                </strong>
              </v-alert>
            </div>
          </template>
        </template>
      </div>
    </div>

    <!-- Invoices Section -->
    <div class="summary-section">
      <div class="section-subheader">
        <v-icon icon="mdi-currency-usd" color="orange-darken-2" size="24" class="me-2"></v-icon>
        <h3 class="section-subtitle">فاکتور های ثبت شده برای مشتری (5 فاکتور آخر)</h3>
      </div>
      <div class="section-content">
        <template v-if="loading_invoices">
          <v-skeleton-loader
              v-for="i in 5"
              class="mx-auto mb-4"
              elevation="0"
              type="article,actions"

          ></v-skeleton-loader>

        </template>
        <template v-else>
          <template v-if="invoices.length">
            <div v-for="invoice in invoices" :key="invoice.id" class="animate__animated animate__zoomInDown">
              <invoice_single class="mb-4" :invoice="invoice"></invoice_single>
            </div>
          </template>
          <template v-else>
            <div class="empty-state">
              <v-alert
                  border="top"
                  color="orange-darken-2"
                  variant="tonal"
                  prominent
              >
                <strong>
                  هنوز هیچ فاکتوری برای این مشتری ثبت نگردیده است !
                </strong>
              </v-alert>
            </div>
          </template>
        </template>
      </div>
    </div>
  </template>




</template>

<style scoped>
/* Section Header */
.section-header {
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e3f2fd;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  right: 0;
  width: 60px;
  height: 2px;
  background: #2196f3;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
}

/* Summary Sections */
.summary-section {
  margin-bottom: 32px;
}

.section-subheader {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.section-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0 12px;
  line-height: 1.4;
}

.section-content {
  padding: 0 4px;
}

/* Empty State */
.empty-state {
  margin: 16px 0;
  text-align: center;
}

/* Mobile Responsive */
@media (max-width: 960px) {
  .section-header {
    margin-bottom: 20px;
    padding-bottom: 10px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .summary-section {
    margin-bottom: 24px;
  }
  
  .section-subheader {
    padding: 10px 12px;
    margin-bottom: 12px;
  }
  
  .section-subtitle {
    font-size: 14px;
  }
  
  .section-content {
    padding: 0 2px;
  }
}

@media (max-width: 600px) {
  .section-header {
    margin-bottom: 16px;
    padding-bottom: 8px;
  }
  
  .section-title {
    font-size: 16px;
  }
  
  .summary-section {
    margin-bottom: 20px;
  }
  
  .section-subheader {
    padding: 8px 10px;
    margin-bottom: 10px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .section-subtitle {
    font-size: 13px;
    margin: 0;
  }
}
</style>