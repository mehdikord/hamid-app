<script>
import Actions_Customer_Status from "@/components/actions/Actions_Customer_Status.vue";

export default {
  name: "Customers_Seller_Item",
  emits: ['Set_Report', 'Set_Invoice', 'change_status', 'select'],
  components: {
    Actions_Customer_Status
  },
  props: {
    customer: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      add_report_dialog: false,
      add_invoice_dialog: false,
      show_buttons: false,
    }
  },
  methods: {
    Create_Report(item) {
      this.$emit('Set_Report', item)
      // Modal closing is now handled by the action component
    },
    Create_Invoice(item) {
      this.$emit('Set_Invoice', item)
      // Modal closing is now handled by the action component
    },
    Change_Status(item) {
      this.$emit('change_status', item);
    },
    openReportDialog() {
      this.add_report_dialog = true;
    },
    openInvoiceDialog() {
      this.add_invoice_dialog = true;
    },
    toggleButtons() {
      this.show_buttons = !this.show_buttons;
      // Emit selection event to parent
      this.$emit('select', this.customer.id);
    },
    makeCall() {
      // Open phone dialer with customer's phone number
      const phoneNumber = this.customer.customer.phone;
      if (phoneNumber) {
        window.open(`tel:${phoneNumber}`, '_self');
      }
    },
    openWhatsApp() {
      // Open WhatsApp with customer's phone number and سلام message
      const phoneNumber = this.customer.customer.phone;
      if (phoneNumber) {
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        const whatsappPhone = cleanPhone.startsWith('98') ? cleanPhone : `98${cleanPhone}`;
        const message = encodeURIComponent('سلام');
        const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${message}`;
        window.open(whatsappUrl, '_blank');
      }
    }
  },
  watch: {
    isSelected(newValue) {
      // Update local show_buttons state when parent selection changes
      this.show_buttons = newValue;
    }
  },
  mounted() {

  }
}
</script>

<template>
  <template v-if="customer">
      <v-card 
        class="customer-card"
        variant="outlined"
        rounded="lg"
        :class="{ 'show-buttons': isSelected, 'selected': isSelected }"
        @click="toggleButtons"
      >
      <!-- Compact Header -->
      <v-card-item class="pa-4">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar 
              size="40" 
              color="primary" 
              variant="tonal"
              class="me-3"
            >
              <v-icon icon="mdi-account" size="20"></v-icon>
            </v-avatar>
            <div class="mr-4">
              <router-link 
                :to="{name:'customers_profile',params:{id:customer.customer.id}}"
                class="text-decoration-none"
              >
                <h3 class="text-h6 font-weight-bold mb-2 text-primary">
                  {{ customer.customer.name }}
                </h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  {{ customer.customer.phone }}
                </p>
              </router-link>
            </div>
          </div>
          <actions_customer_status 
            :customer="customer" 
            @changed="(item) => Change_Status(item)" 
            :show_level="true"
          ></actions_customer_status>
        </div>
      </v-card-item>

      <!-- Compact Content -->
      <v-card-text class="pa-4 pt-0 pb-2">
        <v-list density="compact" class="pa-0">
          <!-- Project -->
          <v-list-item class="px-3 py-1">
            <template v-slot:prepend>
              <v-icon icon="mdi-folder-outline" size="16" color="medium-emphasis"></v-icon>
            </template>
            <v-list-item-title class="text-body-2">
              <span class="text-medium-emphasis">پروژه:</span>
              <span class="font-weight-medium ms-1">{{ customer.project.name }}</span>
            </v-list-item-title>
          </v-list-item>

          <!-- Status -->
          <v-list-item class="px-3 py-1">
            <template v-slot:prepend>
              <v-icon icon="mdi-flag-outline" size="16" color="medium-emphasis"></v-icon>
            </template>
            <v-list-item-title class="text-body-2 d-flex align-center">
              <span class="text-medium-emphasis">وضعیت:</span>
              <actions_customer_status 
                :customer="customer" 
                @changed="(item) => Change_Status(item)"
              ></actions_customer_status>
            </v-list-item-title>
          </v-list-item>

          <!-- Registration Date -->
          <v-list-item class="px-3 py-1">
            <template v-slot:prepend>
              <v-icon icon="mdi-calendar-plus-outline" size="16" color="medium-emphasis"></v-icon>
            </template>
            <v-list-item-title class="text-body-2">
              <span class="text-medium-emphasis">ثبت:</span>
              <span class="font-weight-medium ms-1">
                {{ this.$filters.date_jalali( customer.cretad_at,'jYYYY/jM/jD') }}
              </span>
            </v-list-item-title>
          </v-list-item>

          <!-- Last Report -->
          <v-list-item v-if="customer.last_report" class="px-3 py-1">
            <template v-slot:prepend>
              <v-icon icon="mdi-text-box-outline" size="16" color="medium-emphasis"></v-icon>
            </template>
            <v-list-item-title class="text-body-2">
              <span class="text-medium-emphasis">آخرین گزارش:</span>
              <span class="font-weight-medium ms-1 text-primary">
                {{ this.$filters.date_jalali(customer.last_report.created_at,'jYYYY/jM/jD') }}
              </span>
              <span class="text-medium-emphasis ms-2">-</span>
              <span class="font-weight-medium ms-1">
                {{ this.Helper_Text_Shorter(customer.last_report.report, 50) }}
              </span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>

      <!-- Compact Actions -->
      <div class="actions-container" :class="{ 'actions-visible': isSelected }">
        <v-card-actions class="pa-4 pt-0">
          <div class="equal-buttons-container">
            <v-btn
              :to="{name:'customers_profile',params:{id:customer.customer.id}}"
              color="primary"
              variant="outlined"
              class="action-btn equal-btn"
              size="small"
              rounded="lg"
            >
              <v-icon icon="mdi-account" size="18"></v-icon>
            </v-btn>
            <v-btn
              @click.stop="openReportDialog"
              color="purple"
              variant="flat"
              class="action-btn equal-btn"
              size="small"
              rounded="lg"
            >
              <v-icon icon="mdi-text-box-edit" size="18"></v-icon>
            </v-btn>
            <v-btn
              @click.stop="openInvoiceDialog"
              color="info"
              variant="flat"
              class="action-btn equal-btn"
              size="small"
              rounded="lg"
            >
              <v-icon icon="mdi-currency-usd" size="18"></v-icon>
            </v-btn>
            <v-btn
              @click.stop="makeCall"
              color="teal"
              variant="flat"
              class="action-btn equal-btn"
              size="small"
              rounded="lg"
            >
              <v-icon icon="mdi-phone" size="18"></v-icon>
            </v-btn>
            <v-btn
              @click.stop="openWhatsApp"
              color="green"
              variant="flat"
              class="action-btn equal-btn"
              size="small"
              rounded="lg"
            >
              <v-icon icon="mdi-whatsapp" size="18"></v-icon>
            </v-btn>
          </div>
        </v-card-actions>
      </div>
          <v-dialog
              v-model="add_report_dialog"
              :max-width="$vuetify.display.mdAndUp ? '600' : '95'"
              :fullscreen="$vuetify.display.smAndDown"
              transition="dialog-bottom-transition"
          >
            <v-card 
              variant="flat" 
              rounded="lg"
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
                        گزارش جدید برای مشتری {{ customer.customer.name || customer.customer.phone }}
                      </p>
                    </div>
                  </div>
                </div>
              </v-card-item>
              
              <v-divider class="mx-4 mx-sm-6"></v-divider>
              
              <!-- Content Area -->
              <v-card-item class="pa-4 pa-sm-6 pt-0">
                <actions_customer_project_report_create 
                  @Created="(item) => Create_Report(item)" 
                  :customer="customer.customer"
                  :onCancel="() => add_report_dialog = false"
                ></actions_customer_project_report_create>
              </v-card-item>
            </v-card>
          </v-dialog>
          <v-dialog
              v-model="add_invoice_dialog"
              :max-width="$vuetify.display.mdAndUp ? '600' : '95'"
              :fullscreen="$vuetify.display.smAndDown"
              transition="dialog-bottom-transition"
          >
            <v-card 
              variant="flat" 
              rounded="lg"
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
                        فاکتور جدید برای مشتری {{ customer.customer.name || customer.customer.phone }}
                      </p>
                    </div>
                  </div>
                </div>
              </v-card-item>
              
              <v-divider class="mx-4 mx-sm-6"></v-divider>
              
              <!-- Content Area -->
              <v-card-item class="pa-4 pa-sm-6 pt-0">
                <actions_customer_project_invoice_create 
                  @Created="(get_item) => Create_Invoice(get_item)" 
                  :customer="customer.customer"
                  :onCancel="() => add_invoice_dialog = false"
                ></actions_customer_project_invoice_create>
              </v-card-item>
            </v-card>
          </v-dialog>
    </v-card>
  </template>

</template>

<style scoped>
/* Clean card styling with soft black border */
.customer-card {
  transition: all 0.15s ease;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  border-radius: 12px !important;
}

.customer-card:hover {
  border-color: rgba(0, 0, 0, 0.2) !important;
}

.customer-card.show-buttons {
  border-color: rgba(0, 0, 0, 0.25) !important;
}

.customer-card.selected {
  border-color: rgba(var(--v-theme-primary), 0.5) !important;
  background-color: rgba(var(--v-theme-primary), 0.02) !important;
}

/* Smooth slide animation for actions */
.actions-container {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
}

.actions-container.actions-visible {
  max-height: 120px;
  opacity: 1;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease 0.1s;
}

/* Simple button styling */
.action-btn {
  transition: all 0.1s ease;
  min-height: 36px;
}

/* Fix alignment issues */
.customer-card .v-avatar {
  margin-left: 0 !important;
}

.customer-card .v-list-item {
  align-items: flex-start !important;
}

.customer-card .v-list-item__prepend {
  margin-top: 2px !important;
}

/* Font consistency */
.customer-card,
.customer-card *,
.customer-card .v-card-item,
.customer-card .v-card-text,
.customer-card .v-card-actions,
.customer-card .v-list,
.customer-card .v-list-item,
.customer-card .v-list-item-title,
.customer-card .v-btn,
.customer-card .v-chip,
.customer-card h3,
.customer-card p,
.customer-card span {
  font-family: inherit !important;
}

/* Typography improvements */
.customer-card h3 {
  font-weight: 600 !important;
  line-height: 1.25 !important;
}

.customer-card .text-body-2 {
  line-height: 1.4 !important;
}

.customer-card .v-btn {
  font-weight: 500 !important;
  text-transform: none !important;
  letter-spacing: 0.25px !important;
}

.customer-card .v-chip {
  font-weight: 500 !important;
}

/* Compact Action Buttons */
.action-btn {
  min-height: 36px !important;
}

/* Equal width buttons container */
.equal-buttons-container {
  display: flex;
  gap: 4px;
  width: 100%;
}

.equal-btn {
  flex: 1;
  min-width: 0;
}

/* Reduce space between icon and text for invoice button */
.action-btn .v-btn__prepend {
  margin-inline-end: 4px !important;
}

/* Dialog title styling */
.v-dialog .v-card-item h3.text-h5 {
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  font-family: inherit !important;
}

/* Profile link styling */
.customer-card .router-link {
  transition: all 0.15s ease !important;
}

.customer-card .router-link:hover h3 {
  color: rgb(var(--v-theme-primary-darken-1)) !important;
  transform: translateX(-2px) !important;
}

.customer-card .router-link:hover p {
  color: rgb(var(--v-theme-primary)) !important;
}

/* Status badge alignment fix for mobile */
.customer-card .v-list-item-title.d-flex {
  align-items: center !important;
  gap: 8px !important;
}

.customer-card .v-list-item-title .v-btn {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  height: 24px !important;
  min-height: 24px !important;
  font-size: 11px !important;
  padding: 0 8px !important;
}

</style>