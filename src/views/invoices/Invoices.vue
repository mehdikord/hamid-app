<template>
  <v-card flat border rounded>
    <v-card-item>
      <div>
        <v-icon icon="mdi mdi-receipt" size="35" color="deep-orange-darken-2" class="me-2"></v-icon>
        <strong class="color-dark-text font-15">لیست فاکتورهای ثبت شده</strong>
      </div>
      <div class="mt-4">
        <v-row>
          <v-col cols="12" md="4">
            <v-select
                variant="outlined"
                rounded
                label="انتخاب پروژه"
                :items="projectOptions"
                v-model="query_params.project_id"
                item-title="name" 
                item-value="id"
                color="deep-orange-darken-2"
                density="comfortable"
                clearable
                @update:model-value="Get_Invoices"
                @click:clear="Clear_Project"
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="4">
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
              type="datetime" 
              v-model="from_date" 
              format="YYYY-MM-DD HH:mm" 
              display-format="jYYYY-jMM-jDD HH:mm"
              custom-input=".custom-date-input-from"
              @change="onFromDateChange"
            />
          </v-col>
          <v-col cols="12" md="4">
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
              type="datetime" 
              v-model="to_date" 
              format="YYYY-MM-DD HH:mm" 
              display-format="jYYYY-jMM-jDD HH:mm"
              custom-input=".custom-date-input-to"
              @change="onToDateChange"
            />
          </v-col>
        </v-row>  
      </div>
    </v-card-item>
  </v-card>

  <!-- Invoices List -->
  <div class="mt-6">
    <v-card v-if="invoices_loading" flat border rounded>
      <v-card-item>
        <!-- Desktop Skeleton -->
        <template v-if="!$vuetify.display.smAndDown">
          <v-skeleton-loader
            v-for="i in 5"
            :key="i"
            type="table-row"
            class="mb-2"
          ></v-skeleton-loader>
        </template>
        <!-- Mobile Skeleton -->
        <template v-else>
          <v-skeleton-loader
            v-for="i in 3"
            :key="i"
            type="article"
            class="mb-3"
          ></v-skeleton-loader>
        </template>
      </v-card-item>
    </v-card>

    <div v-else-if="invoices.length === 0" class="mt-6">
      <Global_No_Items />
    </div>

    <div v-else>
      <!-- Desktop Table View -->
      <div v-if="!$vuetify.display.smAndDown" class="desktop-table-view">
        <div class="mb-3">
          <strong class="text-grey-darken-1 font-15">تعداد کل آیتم ها : </strong>
          <strong class="ms-1 font-15 text-indigo">{{ $filters.number_format(pagination.total) }}</strong>
        </div>
        <v-table class="custom-table-responsive" hover style="border-radius: 7px">
          <thead>
            <tr class="bg-grey-darken-3">
              <th>تاریخ</th>
              <th>مشتری</th>
              <th>پروژه</th>
              <th>مبلغ</th>
              <th>فایل</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in invoices" :key="invoice.id" class="animate__animated animate__fadeIn">
              <td class="pa-2">
                <chips_date :date="invoice.created_at"></chips_date>
              </td>
              <td class="pa-2">
                <router-link 
                  v-if="invoice.customer?.id"
                  :to="{name:'customers_profile',params:{id:invoice.customer.id}}"
                  class="text-decoration-none"
                >
                  <div class="d-flex flex-column">
                    <strong class="font-14 text-black">{{ invoice.customer?.phone || invoice.customer?.name || '-' }}</strong>
                    <template v-if="invoice.customer?.phone && invoice.customer?.name">
                      <span class="text-grey-darken-4 font-12 mt-1">{{ invoice.customer.name }}</span>
                    </template>
                  </div>
                </router-link>
                <div v-else class="d-flex flex-column">
                  <strong class="font-14 text-black">{{ invoice.customer?.phone || invoice.customer?.name || '-' }}</strong>
                  <template v-if="invoice.customer?.phone && invoice.customer?.name">
                    <span class="text-grey-darken-4 font-12 mt-1">{{ invoice.customer.name }}</span>
                  </template>
                </div>
              </td>
              <td class="pa-2">
                <strong class="text-indigo-darken-1 font-12">{{ invoice.project?.name || '-' }}</strong>
              </td>
              <td class="pa-2">
                <strong class="text-orange-darken-2 font-14">{{ $filters.number_format(invoice.amount) }} تومان</strong>
              </td>
              <td class="pa-2">
                <v-btn 
                  v-if="invoice.file_url"
                  @click="Helper_Downloader(invoice.file_url, invoice.file_name)"
                  variant="text" 
                  color="deep-orange-darken-2" 
                  size="small"
                  prepend-icon="mdi-download"
                >
                  {{ Helper_Text_Shorter(invoice.file_name, 20) }}
                </v-btn>
                <span v-else class="font-12 text-grey">-</span>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <!-- Mobile Card View -->
      <div v-else class="mobile-card-view">
        <div v-for="invoice in invoices" :key="invoice.id" class="animate__animated animate__fadeIn mb-6">
          <v-card 
            class="invoice-card" 
            variant="outlined" 
            rounded="lg"
          >
            <!-- Compact Header -->
            <v-card-item class="pa-4">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-avatar 
                    size="40" 
                    color="deep-orange-darken-2" 
                    variant="tonal"
                    class="me-3"
                  >
                    <v-icon icon="mdi-receipt" size="20"></v-icon>
                  </v-avatar>
                  <div class="mr-4 flex-grow-1">
                    <router-link 
                      v-if="invoice.customer?.id"
                      :to="{name:'customers_profile',params:{id:invoice.customer.id}}"
                      class="text-decoration-none"
                    >
                      <h3 class="text-h6 font-weight-bold mb-2 text-primary">
                        {{ invoice.customer?.name || invoice.customer?.phone || '-' }}
                      </h3>
                    </router-link>
                    <h3 v-else class="text-h6 font-weight-bold mb-2 text-primary">
                      {{ invoice.customer?.name || invoice.customer?.phone || '-' }}
                    </h3>
                    <router-link 
                      v-if="invoice.customer?.id && invoice.customer?.phone"
                      :to="{name:'customers_profile',params:{id:invoice.customer.id}}"
                      class="text-decoration-none"
                    >
                      <p class="text-body-2 text-medium-emphasis mb-0">
                        {{ invoice.customer.phone }}
                      </p>
                    </router-link>
                    <p v-else-if="invoice.customer?.phone" class="text-body-2 text-medium-emphasis mb-0">
                      {{ invoice.customer.phone }}
                    </p>
                  </div>
                </div>
                <chips_date :date="invoice.created_at"></chips_date>
              </div>
            </v-card-item>

              <!-- Compact Content -->
              <v-card-text class="pa-4 pt-0 pb-2">
                <v-list density="compact" class="pa-0">
                  <!-- Amount -->
                  <v-list-item class="px-3 py-1">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-cash" size="16" color="medium-emphasis"></v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      <span class="text-medium-emphasis">مبلغ:</span>
                      <span class="font-weight-bold ms-1 text-orange-darken-2">{{ $filters.number_format(invoice.amount) }} تومان</span>
                    </v-list-item-title>
                  </v-list-item>

                  <!-- Project -->
                  <v-list-item v-if="invoice.project?.name" class="px-3 py-1">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-folder-outline" size="16" color="medium-emphasis"></v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      <span class="text-medium-emphasis">پروژه:</span>
                      <span class="font-weight-medium ms-1 text-indigo-darken-1">{{ invoice.project.name }}</span>
                    </v-list-item-title>
                  </v-list-item>

                  <!-- Description -->
                  <v-list-item v-if="invoice.description" class="px-3 py-1">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-text-box-outline" size="16" color="medium-emphasis"></v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      <span class="text-medium-emphasis">توضیحات:</span>
                      <span class="font-weight-medium ms-1">{{ Helper_Text_Shorter(invoice.description, 50) }}</span>
                    </v-list-item-title>
                  </v-list-item>

                  <!-- File -->
                  <v-list-item v-if="invoice.file_url" class="px-3 py-1">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-attachment" size="16" color="medium-emphasis"></v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      <span class="text-medium-emphasis">فایل:</span>
                      <v-btn 
                        @click.stop="Helper_Downloader(invoice.file_url, invoice.file_name)"
                        variant="text" 
                        color="deep-orange-darken-2" 
                        size="x-small"
                        class="ms-1"
                        prepend-icon="mdi-download"
                      >
                        {{ Helper_Text_Shorter(invoice.file_name, 20) }}
                      </v-btn>
                    </v-list-item-title>
                  </v-list-item>

                  <!-- User Info -->
                  <v-list-item v-if="invoice.user?.name" class="px-3 py-1">
                    <template v-slot:prepend>
                      <v-icon icon="mdi-account-circle-outline" size="16" color="medium-emphasis"></v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      <span class="text-medium-emphasis">کاربر:</span>
                      <span class="font-weight-medium ms-1">{{ invoice.user.name }}</span>
                      <template v-if="invoice.user.phone">
                        <span class="text-grey-darken-4 font-12 ms-2">({{ invoice.user.phone }})</span>
                      </template>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
          </v-card>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-6" v-if="pagination && pagination.total > 0">
        <Action_Data_Table_Pagination 
          :data="pagination"
          @PerPageChange="Change_Per_Page"
          @ChangePage="Change_Page"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {Stores_Projects} from "@/stores/projects/projects.js";
import {Stores_Invoices} from "@/stores/invoices/invoices.js";
import Action_Data_Table_Pagination from "@/components/actions/data/Action_Data_Table_Pagination.vue";
import Global_No_Items from "@/components/global/Global_No_Items.vue";

export default {
  name: 'Invoices',
  components: {
    Action_Data_Table_Pagination,
    Global_No_Items
  },
  mounted() {
    this.Get_Projects();
  },
  watch: {
    'query_params.project_id'() {
      this.Get_Invoices();
    }
  },
  data() {
    return {
      projects: [],
      invoices: [],
      invoices_loading: true,
      from_date: null,
      to_date: null,
      query_params: {
        per_page: 30,
        project_id: null,
        page: 1
      },
      pagination: {
        current: 1,
        per_page: 30,
        from: 0,
        to: 0,
        total: 0,
        last_page: 1,
        links: []
      }
    }
  },
  computed: {
    formattedFromDate() {
      if (this.from_date) {
        return this.$filters.date_jalali(this.from_date, 'jYYYY/jM/jD H:m');
      }
      return '';
    },
    formattedToDate() {
      if (this.to_date) {
        return this.$filters.date_jalali(this.to_date, 'jYYYY/jM/jD H:m');
      }
      return '';
    },
    projectOptions() {
      // Add "All Projects" option at the beginning
      const allOption = { id: null, name: 'همه پروژه‌ها' };
      return [allOption, ...this.projects];
    }
  },
  methods: {
    Get_Projects() {
      Stores_Projects().All().then(res => {
        this.projects = res.data.result;
        // Load invoices with no project_id initially to show all invoices
        this.Get_Invoices();
      }).catch(error => {
        console.error('Error loading projects data:', error);
      })
    },
    Get_Invoices() {
      this.invoices_loading = true;

      // Build query params
      const params = {
        per_page: this.query_params.per_page,
        page: this.query_params.page
      };

      // Only include project_id if it's selected (not null)
      if (this.query_params.project_id) {
        params.project_id = this.query_params.project_id;
      }

      // Date picker already outputs dates in YYYY-MM-DD HH:mm format
      if (this.from_date) {
        params.from_date = this.from_date;
      }
      if (this.to_date) {
        params.to_date = this.to_date;
      }

      Stores_Invoices().Index(params).then(res => {
        if (res.data && res.data.result) {
          this.invoices = res.data.result.data || [];
          
          if (res.data.result) {
            this.pagination.current = res.data.result.current_page;
            this.pagination.per_page = res.data.result.per_page;
            this.pagination.from = res.data.result.from;
            this.pagination.to = res.data.result.to;
            this.pagination.total = res.data.result.total;
            this.pagination.last_page = res.data.result.last_page;
            this.pagination.links = res.data.result.links;
          }
        }
        this.invoices_loading = false;
      }).catch(error => {
        console.error('Error loading invoices:', error);
        this.invoices_loading = false;
      })
    },
    onFromDateChange() {
      this.Get_Invoices();
    },
    onToDateChange() {
      this.Get_Invoices();
    },
    Clear_Project() {
      this.query_params.project_id = null;
      this.Get_Invoices();
    },
    Change_Per_Page(page) {
      this.query_params.per_page = page;
      this.query_params.page = 1;
      this.Get_Invoices();
    },
    Change_Page(page) {
      this.query_params.page = page;
      this.Get_Invoices();
    }
  }
}
</script>

<style scoped>
.color-dark-text {
  color: #333;
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

/* Desktop Table Styling */
.desktop-table-view {
  margin-bottom: 20px;
}

.desktop-table-view .v-table {
  background-color: white;
}

.desktop-table-view .v-table thead th {
  color: white !important;
  font-weight: 600;
  text-align: right;
  padding: 12px 16px;
}

.desktop-table-view .v-table tbody td {
  vertical-align: middle;
}

/* Column width adjustments */
.desktop-table-view .v-table thead th:nth-child(1),
.desktop-table-view .v-table tbody td:nth-child(1) {
  width: 15%;
  min-width: 120px;
}

.desktop-table-view .v-table thead th:nth-child(2),
.desktop-table-view .v-table tbody td:nth-child(2) {
  width: 25%;
  min-width: 180px;
  padding-left: 8px;
  padding-right: 12px;
}

.desktop-table-view .v-table thead th:nth-child(3),
.desktop-table-view .v-table tbody td:nth-child(3) {
  width: 15%;
  min-width: 120px;
  padding-left: 8px;
  padding-right: 12px;
}

.desktop-table-view .v-table thead th:nth-child(4),
.desktop-table-view .v-table tbody td:nth-child(4) {
  width: 20%;
  min-width: 120px;
}

.desktop-table-view .v-table thead th:nth-child(5),
.desktop-table-view .v-table tbody td:nth-child(5) {
  width: 25%;
}

.desktop-table-view .v-table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.desktop-table-view .v-table tbody a {
  transition: all 0.15s ease !important;
  text-decoration: none !important;
}

.desktop-table-view .v-table tbody a:hover strong {
  color: rgb(var(--v-theme-primary)) !important;
}

.desktop-table-view .v-table tbody a:hover span {
  color: rgb(var(--v-theme-primary-darken-1)) !important;
}

/* Invoice Card Styling */
.invoice-card {
  position: relative;
  overflow: hidden;
  transition: all 0.15s ease;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  border-radius: 12px !important;
}

.invoice-card:hover {
  border-color: rgba(0, 0, 0, 0.2) !important;
}

/* Mobile Card Styling */
.mobile-card-view .invoice-card {
  margin-bottom: 24px;
}

.mobile-card-view .invoice-card .v-card-item {
  padding: 16px !important;
}

.mobile-card-view .invoice-card .v-card-text {
  padding: 16px !important;
  padding-top: 0 !important;
}

/* Fix alignment issues */
.invoice-card .v-avatar {
  margin-left: 0 !important;
}

.invoice-card .v-list-item {
  align-items: flex-start !important;
}

.invoice-card .v-list-item__prepend {
  margin-top: 2px !important;
}

/* Font consistency */
.invoice-card,
.invoice-card *,
.invoice-card .v-card-item,
.invoice-card .v-card-text,
.invoice-card .v-list,
.invoice-card .v-list-item,
.invoice-card .v-list-item-title,
.invoice-card h3,
.invoice-card p,
.invoice-card span {
  font-family: inherit !important;
}

/* Typography improvements */
.invoice-card h3 {
  font-weight: 600 !important;
  line-height: 1.25 !important;
}

.invoice-card .text-body-2 {
  line-height: 1.4 !important;
}

/* Profile link styling */
.invoice-card .router-link {
  transition: all 0.15s ease !important;
}

.invoice-card .router-link:hover h3 {
  color: rgb(var(--v-theme-primary-darken-1)) !important;
  transform: translateX(-2px) !important;
}

.invoice-card .router-link:hover p {
  color: rgb(var(--v-theme-primary)) !important;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .invoice-card {
    margin-bottom: 12px;
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

