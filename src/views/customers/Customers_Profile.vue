<script>
import {Stores_Customer} from "@/stores/customers/customers.js";
import profileBg from '@/assets/images/backgrounds/custoemer-bg.png';
import Profile from '@/assets/images/icons/customer.svg'
import Customer_Profile_Summery from "@/views/customers/components/Customer_Profile_Summery.vue";
import Customer_Profile_Reports from "@/views/customers/components/Customer_Profile_Reports.vue";
import Customer_Profile_Invoices from "@/views/customers/components/Customer_Profile_Invoices.vue";
import Action_Customer_Reminder_Create from "@/components/actions/Action_Customer_Reminder_Create.vue";
import { useTitle } from '@/composables/useTitle.js';

export default {
  name: "Customers_Profile",
  components:{
    'profile_summery' : Customer_Profile_Summery,
    'profile_reports' : Customer_Profile_Reports,
    'profile_invoices' : Customer_Profile_Invoices,
    'actions_customer_reminder_create' : Action_Customer_Reminder_Create,
  },
  setup() {
    const { updateCustomerTitle } = useTitle();
    return {
      updateCustomerTitle
    };
  },
  mounted() {
    this.Get_Customer();

  },
  data(){
    return {
      profileBg,
      Profile,
      loading: true,
      customer:null,
      edit_dialog:false,
      report_dialog:false,
      invoice_dialog:false,
      reminder_dialog:false,
      summery_key:0,
      active_tab: 0,
    }
  },
  computed: {
    currentTab() {
      const routeMap = {
        'customers_profile': 0,
        'customers_profile_reports': 1,
        'customers_profile_invoices': 2
      };
      return routeMap[this.$route.name] || 0;
    }
  },
  methods:{
    Get_Customer(){
      Stores_Customer().Show({id : this.$route.params.id}).then(res=>{
        this.customer = res.data.result;
        this.loading = false;
        // Update title with customer information
        this.updateCustomerTitle(this.customer);
      }).catch(error=>{
        this.Notify_Error_Server();

      })
    },
    Update_Customer(item){
      this.customer = item;
      this.edit_dialog = false;
      // Update title with updated customer information
      this.updateCustomerTitle(this.customer);
      this.Notify_Success('اطلاعات مشتری با موفقیت ویراش گردید')
    },
    Create_Report(){
      this.summery_key ++;
      this.report_dialog=false;
      this.Notify_Success('گزارش مورد نظر باموفقیت ثبت گردید')

    },
    Create_Invoice(){
      this.summery_key ++;
      this.invoice_dialog=false;
      this.Notify_Success('فاکتور مورد نظر باموفقیت ثبت گردید')
    },
    Create_Reminder(){
      this.summery_key ++;
      this.reminder_dialog=false;
      this.Notify_Success('یادآور مورد نظر باموفقیت ثبت گردید')
    },
    switchTab(tabIndex) {
      this.active_tab = tabIndex;
      // Navigate to the appropriate route based on tab
      const routes = [
        { name: 'customers_profile', params: { id: this.customer.id } },
        { name: 'customers_profile_reports', params: { id: this.customer.id } },
        { name: 'customers_profile_invoices', params: { id: this.customer.id } }
      ];
      if (this.$route.name !== routes[tabIndex].name) {
        this.$router.push(routes[tabIndex]);
      }
    }
  }
}
</script>

<template>

  <template v-if="loading">
    <v-skeleton-loader
        class="mt-10"
        elevation="1"
        height="400"
        type="avatar,table-heading, list-item-two-line, image, table-tfoot"
    ></v-skeleton-loader>
  </template>
  <template v-else>
    <v-row class="mt-1">
      <v-col xs="12" md="4" lg="4" xl="3" sm="12" cols="12">
        <v-card flat border class="animate__animated animate__backInDown profile-card ">
          <v-img
              class="profile-header-bg"
              height="150"
              :src="profileBg"
              cover
          >
          </v-img>
          
          <!-- Overlapping Avatar -->
          <div class="avatar-container">
            <v-avatar class="profile-avatar" :image="Profile" size="100"></v-avatar>
          </div>
          
          <div class="profile-content">
            <!-- Profile Header -->
            <div class="profile-header">
              <div class="profile-info">
                <h2 class="profile-name">{{ customer.name ?? 'نام نامشخص' }}</h2>
                <p class="profile-phone">{{ customer.phone }}</p>
                <p class="profile-description" v-if="customer.description">{{ customer.description }}</p>
              </div>
            </div>

            <!-- Customer Information Section -->
            <div class="info-section">
              <!-- <h3 class="section-title">اطلاعات حقیقی مشتری</h3> -->
              
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-icon">
                    <v-icon icon="mdi-account" color="primary"></v-icon>
                  </div>
                  <div class="info-content">
                    <span class="info-label">نام کامل</span>
                    <span class="info-value">{{ customer.name ?? '---' }}</span>
                  </div>
                </div>

                <div class="info-item" v-if="customer.instagram_id">
                  <div class="info-icon">
                    <v-icon icon="mdi-instagram" color="primary"></v-icon>
                  </div>
                  <div class="info-content">
                    <span class="info-label">اینستاگرام</span>
                    <span class="info-value">{{ customer.instagram_id }}</span>
                  </div>
                </div>

                <div class="info-item" v-if="customer.telegram_id">
                  <div class="info-icon">
                    <v-icon icon="mdi-send" color="primary"></v-icon>
                  </div>
                  <div class="info-content">
                    <span class="info-label">تلگرام</span>
                    <span class="info-value">{{ customer.telegram_id }}</span>
                  </div>
                </div>

                <div class="info-item" v-if="customer.province">
                  <div class="info-icon">
                    <v-icon icon="mdi-map-marker" color="primary"></v-icon>
                  </div>
                  <div class="info-content">
                    <span class="info-label">استان</span>
                    <span class="info-value">{{ customer.province.name }}</span>
                  </div>
                </div>

                <div class="info-item" v-if="customer.city">
                  <div class="info-icon">
                    <v-icon icon="mdi-city" color="primary"></v-icon>
                  </div>
                  <div class="info-content">
                    <span class="info-label">شهر</span>
                    <span class="info-value">{{ customer.city.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <v-btn 
                @click="edit_dialog = true" 
                variant="flat" 
                color="primary" 
                class="action-btn primary-btn"
                prepend-icon="mdi-pen"
              >
                ویرایش اطلاعات مشتری
              </v-btn>
              
              <div class="secondary-buttons">
                <div class="report-button-group">
                  <v-btn 
                    @click="report_dialog = true" 
                    variant="flat" 
                    color="teal" 
                    class="action-btn secondary-btn"
                    prepend-icon="mdi-text-box-edit"
                  >
                    ثبت گزارش
                  </v-btn>
                  <v-btn 
                    @click="reminder_dialog = true" 
                    variant="flat" 
                    color="purple" 
                    class="action-btn reminder-btn"
                    icon="mdi-bell-outline"
                    size="small"
                  >
                  </v-btn>
                </div>
                <v-btn 
                  @click="invoice_dialog = true" 
                  variant="flat" 
                  color="orange" 
                  class="action-btn secondary-btn"
                  prepend-icon="mdi-currency-usd"
                >
                  ثبت فاکتور
                </v-btn>
              </div>
            </div>

            <!-- Report Dialog -->
            <v-dialog
                v-model="report_dialog"
                :max-width="$vuetify.display.mdAndUp ? '600' : '95'"
                :fullscreen="$vuetify.display.smAndDown"
                transition="dialog-bottom-transition"
            >
              <v-card 
                variant="flat" 
                rounded
                :class="$vuetify.display.smAndDown ? 'h-100' : ''"
                elevation="8"
              >
                <!-- Enhanced Header -->
                <v-card-item class="pa-4 pa-sm-6">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon
                        icon="mdi-text-box-edit"
                        color="teal-darken-2"
                        size="28"
                        class="me-3"
                      ></v-icon>
                      <div>
                        <h3 class="text-h5 font-weight-bold text-primary-darken-2 mb-0">
                          ثبت گزارش جدید
                        </h3>
                        <p class="text-grey-darken-1 mb-0 mt-1">
                          گزارش جدید برای مشتری {{ customer.name || customer.phone }}
                        </p>
                      </div>
                    </div>
                  </div>
                </v-card-item>
                
                <v-divider class="mx-4 mx-sm-6"></v-divider>
                
                <!-- Content Area -->
                <v-card-item class="pa-4 pa-sm-6 pt-0">
                  <actions_customer_project_report_create 
                    @Created="Create_Report" 
                    :customer="customer"
                    :onCancel="() => report_dialog = false"
                  ></actions_customer_project_report_create>
                </v-card-item>
              </v-card>
            </v-dialog>

            <!-- Invoice Dialog -->
            <v-dialog
                v-model="invoice_dialog"
                :max-width="$vuetify.display.mdAndUp ? '600' : '95'"
                :fullscreen="$vuetify.display.smAndDown"
                transition="dialog-bottom-transition"
            >
              <v-card 
                variant="flat" 
                rounded
                :class="$vuetify.display.smAndDown ? 'h-100' : ''"
                elevation="8"
              >
                <!-- Enhanced Header -->
                <v-card-item class="pa-4 pa-sm-6">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon 
                        icon="mdi-currency-usd" 
                        color="orange-darken-2" 
                        size="28"
                        class="me-3"
                      ></v-icon>
                      <div>
                        <h3 class="text-h5 font-weight-bold text-primary-darken-2 mb-0">
                          ثبت فاکتور جدید
                        </h3>
                        <p class="text-grey-darken-1 mb-0 mt-1">
                          فاکتور جدید برای مشتری {{ customer.name || customer.phone }}
                        </p>
                      </div>
                    </div>
                  </div>
                </v-card-item>
                
                <v-divider class="mx-4 mx-sm-6"></v-divider>
                
                <!-- Content Area -->
                <v-card-item class="pa-4 pa-sm-6 pt-0">
                  <actions_customer_project_invoice_create 
                    @Created="Create_Invoice" 
                    :customer="customer"
                    :onCancel="() => invoice_dialog = false"
                  ></actions_customer_project_invoice_create>
                </v-card-item>
              </v-card>
            </v-dialog>

            <!-- Reminder Dialog -->
            <v-dialog
                v-model="reminder_dialog"
                :max-width="$vuetify.display.mdAndUp ? '600' : '95'"
                :fullscreen="$vuetify.display.smAndDown"
                transition="dialog-bottom-transition"
            >
              <v-card 
                variant="flat" 
                rounded
                :class="$vuetify.display.smAndDown ? 'h-100' : ''"
                elevation="8"
              >
                <!-- Enhanced Header -->
                <v-card-item class="pa-4 pa-sm-6">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon
                        icon="mdi-bell-outline"
                        color="purple-darken-2"
                        size="28"
                        class="me-3"
                      ></v-icon>
                      <div>
                        <h3 class="text-h5 font-weight-bold text-primary-darken-2 mb-0">
                          ثبت یادآور جدید
                        </h3>
                        <p class="text-grey-darken-1 mb-0 mt-1">
                          یادآور جدید برای مشتری {{ customer.name || customer.phone }}
                        </p>
                      </div>
                    </div>
                  </div>
                </v-card-item>
                
                <v-divider class="mx-4 mx-sm-6"></v-divider>
                
                <!-- Content Area -->
                <v-card-item class="pa-4 pa-sm-6 pt-0">
                  <actions_customer_reminder_create 
                    @Created="Create_Reminder" 
                    :customer="customer"
                    :onCancel="() => reminder_dialog = false"
                  ></actions_customer_reminder_create>
                </v-card-item>
              </v-card>
            </v-dialog>
          </div>
            <v-dialog
                v-model="edit_dialog"
                :max-width="$vuetify.display.mdAndUp ? '1280' : '95'"
                :fullscreen="$vuetify.display.smAndDown"
                transition="dialog-bottom-transition"
            >
              <v-card 
                variant="flat" 
                rounded
                :class="$vuetify.display.smAndDown ? 'h-100' : ''"
                elevation="8"
              >
                <!-- Enhanced Header -->
                <v-card-item class="pa-4 pa-sm-6">
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon 
                        icon="mdi-account-edit" 
                        color="blue-darken-2" 
                        size="28"
                        class="me-3"
                      ></v-icon>
                      <div>
                        <h3 class="text-h5 font-weight-bold text-primary-darken-2 mb-0">
                          ویرایش اطلاعات مشتری
                        </h3>
                      </div>
                    </div>
                    <v-btn 
                      @click="edit_dialog = false" 
                      variant="text" 
                      icon="mdi-close" 
                      size="small" 
                      color="grey-darken-1"
                      class="rounded-circle"
                    ></v-btn>
                  </div>
                </v-card-item>
                
                <v-divider class="mx-4 mx-sm-6"></v-divider>
                
                <!-- Content Area -->
                <v-card-item class="pa-4 pa-sm-6 pt-0">
                  <actions_customer_edit 
                    @Updated="(item) => Update_Customer(item)" 
                    @Cancel="edit_dialog = false"
                    :customer="customer"
                  ></actions_customer_edit>
                </v-card-item>
              </v-card>
            </v-dialog>
        </v-card>
      </v-col>
      <v-col xs="12" md="8" lg="8" xl="9" sm="12" cols="12">

        <!-- Fabulous Tabs Navigation -->
        <v-card flat class="fabulous-tabs-container">
          <v-tabs
            v-model="currentTab"
            @update:model-value="switchTab"
            color="primary"
            align-tabs="center"
            class="fabulous-tabs"
            slider-color="transparent"
            style="height: 80px !important;"
          >
            <v-tab 
              value="0" 
              class="fabulous-tab tab-summary"
              :class="{ 'tab-active': currentTab === 0 }"
              style="height: 80px !important; min-height: 80px !important; max-height: 80px !important;"
            >
              <div class="tab-content" style="height: 80px !important;">
                <v-icon icon="mdi-view-dashboard" class="tab-icon"></v-icon>
                <span class="tab-text">خلاصه اطلاعات</span>
              </div>
            </v-tab>
            
            <v-tab 
              value="1" 
              class="fabulous-tab tab-reports"
              :class="{ 'tab-active': currentTab === 1 }"
              style="height: 80px !important; min-height: 80px !important; max-height: 80px !important;"
            >
              <div class="tab-content" style="height: 80px !important;">
                <v-icon icon="mdi-text-box-edit-outline" class="tab-icon"></v-icon>
                <span class="tab-text">لیست گزارشات</span>
              </div>
            </v-tab>
            
            <v-tab 
              value="2" 
              class="fabulous-tab tab-invoices"
              :class="{ 'tab-active': currentTab === 2 }"
              style="height: 80px !important; min-height: 80px !important; max-height: 80px !important;"
            >
              <div class="tab-content" style="height: 80px !important;">
                <v-icon icon="mdi-currency-usd" class="tab-icon"></v-icon>
                <span class="tab-text">لیست فاکتور ها</span>
              </div>
            </v-tab>
          </v-tabs>
        </v-card>

        <v-card flat  class="mt-6" style="margin-bottom: 120px">
          <v-card-item>
            <profile_summery :key="summery_key" v-if="this.$route.name === 'customers_profile'" :customer="customer"></profile_summery>
            <profile_reports :key="summery_key" v-if="this.$route.name === 'customers_profile_reports'" :customer="customer"></profile_reports>
            <profile_invoices :key="summery_key" v-if="this.$route.name === 'customers_profile_invoices'" :customer="customer"></profile_invoices>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

  </template>

</template>

<style scoped>
/* Profile Card Container */
.profile-card {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
}

/* Wave-like Background */
.profile-header-bg {
  position: relative;
  border-bottom-left-radius: 50% 20%;
  border-bottom-right-radius: 50% 20%;
  overflow: hidden;
}

/* Alternative smooth wave using clip-path (uncomment to use) */
/* .profile-header-bg {
  position: relative;
  height: 200px;
  clip-path: ellipse(150% 100% at 50% 0%);
} */

/* Avatar Container */
.avatar-container {
  position: absolute;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

/* Profile Avatar */
.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  transition: all 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

/* Modern Profile Content Styles */
.profile-content {
  padding: 20px;
  background: white;
  margin-top: 15px; /* More space for overlapping avatar */
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding-top: 20px; /* Add top padding for better spacing */
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.profile-info {
  flex: 1;
  text-align: center;
}

.profile-name {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.profile-phone {
  font-size: 16px;
  color: #666;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.profile-description {
  font-size: 14px;
  color: #888;
  margin: 0;
  line-height: 1.5;
}

/* Information Section */
.info-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e3f2fd;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  right: 0;
  width: 40px;
  height: 2px;
  background: #2196f3;
}

/* Info Grid */
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.info-item:hover {
  background: #f5f5f5;
  border-color: #e0e0e0;
}

.info-icon {
  margin-left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #e3f2fd;
  border-radius: 10px;
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 16px;
  color: #1a1a1a;
  font-weight: 500;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-btn {
  height: 48px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  border-radius: 12px !important;
  font-size: 16px !important;
  letter-spacing: 0.5px !important;
}

.primary-btn {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%) !important;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3) !important;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4) !important;
}

.secondary-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.report-button-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.report-button-group .secondary-btn {
  flex: 1;
}

.reminder-btn {
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%) !important;
  color: white !important;
  border: none !important;
  min-width: 40px !important;
  width: 40px !important;
  height: 40px !important;
}

.reminder-btn:hover {
  box-shadow: 0 6px 20px rgba(156, 39, 176, 0.3) !important;
  transform: translateY(-1px);
}

.secondary-btn {
  background: linear-gradient(135deg, var(--v-theme-surface) 0%, #f5f5f5 100%) !important;
  border: 1px solid #e0e0e0 !important;
  color: #1a1a1a !important;
}

.secondary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

/* Teal button specific */
.secondary-btn[color="teal"] {
  background: linear-gradient(135deg, #009688 0%, #00796b 100%) !important;
  color: white !important;
  border: none !important;
}

.secondary-btn[color="teal"]:hover {
  box-shadow: 0 6px 20px rgba(0, 150, 136, 0.3) !important;
}

/* Orange button specific */
.secondary-btn[color="orange"] {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%) !important;
  color: white !important;
  border: none !important;
}

.secondary-btn[color="orange"]:hover {
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.3) !important;
}

/* Enhanced Modal Styles for Mobile */
@media (max-width: 960px) {
  .v-dialog .v-card {
    border-radius: 16px 16px 0 0 !important;
  }
  
  .v-dialog .v-card-item {
    padding: 16px !important;
  }
  
  .v-dialog .v-card-actions {
    padding: 16px !important;
  }
  
  .profile-card {
    border: none !important;
  }
  
  .profile-content {
    padding: 12px;
    margin-top: 30px;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    margin-bottom: 10px;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  
  .avatar-container {
    top: 80px;
  }
  
  .profile-avatar {
    width: 85px !important;
    height: 85px !important;
  }
  
  .profile-name {
    font-size: 22px;
    margin-bottom: 6px;
  }
  
  .profile-phone {
    font-size: 16px;
    margin-bottom: 6px;
  }
  
  .profile-description {
    font-size: 12px;
  }
  
  .info-section {
    margin-bottom: 16px;
  }
  
  .section-title {
    font-size: 16px;
    margin-bottom: 12px;
    padding-bottom: 6px;
  }
  
  .info-item {
    padding: 10px;
  }
  
  .info-icon {
    width: 32px;
    height: 32px;
    margin-left: 12px;
  }
  
  .info-label {
    font-size: 11px;
  }
  
  .info-value {
    font-size: 14px;
  }
  
  .action-btn {
    height: 44px !important;
    font-size: 14px !important;
  }
  
  .secondary-buttons {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  
  .report-button-group {
    gap: 6px;
  }
  
  .reminder-btn {
    min-width: 36px !important;
    width: 36px !important;
    height: 36px !important;
  }
}

/* Smooth transitions */
.v-dialog .v-card {
  transition: all 0.3s ease-in-out;
}

.v-btn.rounded-circle:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

/* Better spacing for mobile headers */
@media (max-width: 600px) {
  .v-dialog .v-card-item h3 {
    font-size: 1.25rem !important;
    line-height: 1.4 !important;
    font-family: inherit !important;
  }
  
  .v-dialog .v-card-item p {
    font-size: 0.875rem !important;
  }
  
  .profile-card {
    border: none !important;
  }
  
  .profile-content {
    padding: 10px;
    margin-top: 30px;
  }
  
  .profile-header {
    margin-bottom: 10px;
    padding-top: 6px;
    padding-bottom: 6px;
  }
  
  .avatar-container {
    top: 80px;
  }
  
  .profile-avatar {
    width: 100px !important;
    height: 100px !important;
  }
  
  .profile-name {
    font-size: 20px;
    margin-bottom: 5px;
  }
  
  .profile-phone {
    font-size: 15px;
    margin-bottom: 5px;
  }
  
  .profile-description {
    font-size: 11px;
  }
  
  .info-section {
    margin-bottom: 12px;
  }
  
  .section-title {
    font-size: 15px;
    margin-bottom: 10px;
    padding-bottom: 4px;
  }
  
  .info-item {
    padding: 8px;
  }
  
  .info-icon {
    width: 28px;
    height: 28px;
    margin-left: 10px;
  }
  
  .info-label {
    font-size: 10px;
  }
  
  .info-value {
    font-size: 13px;
  }
  
  .action-btn {
    height: 40px !important;
    font-size: 13px !important;
  }
  
  .secondary-buttons {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .report-button-group {
    gap: 4px;
  }
  
  .reminder-btn {
    min-width: 32px !important;
    width: 32px !important;
    height: 32px !important;
  }
}

/* Ensure proper title styling */
.v-dialog .v-card-item h3.text-h5 {
  font-family: inherit !important;
  font-weight: 700 !important;
  color: rgb(var(--v-theme-primary-darken-2)) !important;
}

/* Clean Fabulous Tabs */
.fabulous-tabs-container {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  overflow: visible;
}

.fabulous-tabs {
  background: transparent;
}

/* Override Vuetify defaults */
.fabulous-tabs .v-tabs__slider {
  display: none !important;
}

.fabulous-tabs .v-tabs__container .v-tab {
  padding: 0 !important;
  margin: 0 !important;
}

.fabulous-tabs .v-tabs__container .v-tab .v-tab__content {
  padding: 0 !important;
  margin: 0 !important;
}

/* Force height on all Vuetify tab elements */
.fabulous-tabs .v-tabs__container,
.fabulous-tabs .v-tabs__wrapper,
.fabulous-tabs .v-tabs__container .v-tab,
.fabulous-tabs .v-tabs__container .v-tab .v-tab__content,
.fabulous-tab,
.fabulous-tab .v-tab__content {
  height: 80px !important;
  min-height: 80px !important;
  max-height: 80px !important;
}

.fabulous-tab {
  margin: 0 4px !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
  background: transparent !important;
  color: #666 !important;
  font-weight: 600 !important;
  text-transform: none !important;
  flex: 1 !important;
}

.fabulous-tab:hover {
  background: rgba(255, 255, 255, 0.8) !important;
}

/* Summary tab (خلاصه اطلاعات) - Blue */
.fabulous-tab.tab-summary.tab-active {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%) !important;
  color: white !important;
}

/* Reports tab (لیست گزارشات) - Teal */
.fabulous-tab.tab-reports.tab-active {
  background: linear-gradient(135deg, #009688 0%, #00796b 100%) !important;
  color: white !important;
}

/* Invoices tab (لیست فاکتور ها) - Orange */
.fabulous-tab.tab-invoices.tab-active {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%) !important;
  color: white !important;
}

.tab-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  height: 100%;
  border-radius: 12px;
}

.tab-icon {
  font-size: 20px !important;
  transition: all 0.3s ease !important;
}

.fabulous-tab.tab-active .tab-icon {
  color: white !important;
  transform: scale(1.1) !important;
}

.tab-text {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  transition: all 0.3s ease;
}

.fabulous-tab.tab-active .tab-text {
  color: white !important;
  font-weight: 700 !important;
}

/* Mobile Responsive */
@media (max-width: 960px) {
  .fabulous-tabs-container {
    padding: 8px;
  }
  
  .fabulous-tabs .v-tabs__container {
    height: 60px !important;
  }
  
  .fabulous-tabs .v-tabs__container .v-tab {
    height: 60px !important;
    min-height: 60px !important;
    max-height: 60px !important;
  }
  
  .fabulous-tab {
    height: 60px !important;
    min-height: 60px !important;
    max-height: 60px !important;
    margin: 0 2px !important;
  }
  
  .tab-content {
    padding: 8px 12px;
    gap: 4px;
  }
  
  .tab-icon {
    font-size: 18px !important;
  }
  
  .tab-text {
    font-size: 12px;
  }
}

@media (max-width: 600px) {
  .fabulous-tabs-container {
    padding: 6px;
  }
  
  .fabulous-tabs .v-tabs__container {
    height: 55px !important;
  }
  
  .fabulous-tabs .v-tabs__container .v-tab {
    height: 55px !important;
    min-height: 55px !important;
    max-height: 55px !important;
  }
  
  .fabulous-tab {
    height: 55px !important;
    min-height: 55px !important;
    max-height: 55px !important;
    margin: 0 1px !important;
  }
  
  .tab-content {
    padding: 6px 8px;
    gap: 3px;
  }
  
  .tab-icon {
    font-size: 16px !important;
  }
  
  .tab-text {
    font-size: 11px;
  }
}

/* Animation for info items */
.info-item {
  animation: fadeInUp 0.3s ease forwards;
}

.info-item:nth-child(1) { animation-delay: 0.1s; }
.info-item:nth-child(2) { animation-delay: 0.2s; }
.info-item:nth-child(3) { animation-delay: 0.3s; }
.info-item:nth-child(4) { animation-delay: 0.4s; }

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