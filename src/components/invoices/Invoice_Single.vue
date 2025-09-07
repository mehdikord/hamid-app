<script>
export default {
  name: "Invoice_Single",
  props:['invoice'],
  data() {
    return {
      showDetails: false
    }
  },
  methods: {
    toggleDetails() {
      this.showDetails = !this.showDetails;
    }
  }
}
</script>

<template>
  <v-card 
    v-if="invoice" 
    class="invoice-card"
    variant="outlined"
    rounded="lg"
    @click="toggleDetails"
  >
    <!-- Compact Header -->
    <v-card-item class="pa-3">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-avatar 
            size="32" 
            color="orange" 
            variant="tonal"
            class="me-2"
          >
            <v-icon icon="mdi-currency-usd" size="16"></v-icon>
          </v-avatar>
          <div class="mr-3">
            <h3 class="text-subtitle-1 font-weight-bold mb-0 text-orange-darken-2">
              فاکتور {{ this.$filters.date_jalali(invoice.created_at, 'jYYYY/jM/jD') }}
            </h3>
            <p class="text-caption text-medium-emphasis mb-0">
              توسط {{ invoice.user.name }}
            </p>
          </div>
        </div>
        <v-chip 
          color="orange" 
          size="x-small"
          variant="flat"
        >
          فاکتور
        </v-chip>
      </div>
    </v-card-item>

    <!-- Compact Content -->
    <v-card-text class="pa-3 pt-0 pb-2">
      <v-list density="compact" class="pa-0">
        <!-- Amount -->
        <v-list-item class="px-2 py-0">
          <template v-slot:prepend>
            <v-icon icon="mdi-cash" size="14" color="medium-emphasis"></v-icon>
          </template>
          <v-list-item-title class="text-caption">
            <span class="text-medium-emphasis">مبلغ:</span>
            <span class="font-weight-bold ms-1 text-orange-darken-2">
              {{ this.$filters.number_format(invoice.amount) }} تومان
            </span>
          </v-list-item-title>
        </v-list-item>

        <!-- Description -->
        <v-list-item class="px-2 py-0">
          <template v-slot:prepend>
            <v-icon icon="mdi-text" size="14" color="medium-emphasis"></v-icon>
          </template>
          <v-list-item-title class="text-caption">
            <span class="text-medium-emphasis">توضیحات:</span>
            <span class="font-weight-medium ms-1">
              {{ this.Helper_Text_Shorter(invoice.description, 40) }}
            </span>
          </v-list-item-title>
        </v-list-item>

        <!-- Project -->
        <v-list-item class="px-2 py-0">
          <template v-slot:prepend>
            <v-icon icon="mdi-folder-outline" size="14" color="medium-emphasis"></v-icon>
          </template>
          <v-list-item-title class="text-caption">
            <span class="text-medium-emphasis">پروژه:</span>
            <span class="font-weight-medium ms-1 text-indigo">{{ invoice.project_customer.project.name }}</span>
          </v-list-item-title>
        </v-list-item>

        <!-- File Attachment -->
        <v-list-item v-if="invoice.file_url" class="px-2 py-0">
          <template v-slot:prepend>
            <v-icon icon="mdi-attachment" size="14" color="medium-emphasis"></v-icon>
          </template>
          <v-list-item-title class="text-caption">
            <span class="text-medium-emphasis">پیوست:</span>
            <v-btn 
              @click.stop="Helper_Downloader(invoice.file_url, invoice.file_name)"
              variant="text" 
              color="orange" 
              size="x-small"
              class="ms-1"
              prepend-icon="mdi-download"
            >
              {{ this.Helper_Text_Shorter(invoice.file_name, 20) }}
            </v-btn>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>

    <!-- Expandable Details -->
    <div class="details-container" :class="{ 'details-visible': showDetails }">
      <v-card-text class="pa-3 pt-0">
        <v-divider class="mb-2"></v-divider>
        <div class="text-caption">
          <strong class="text-medium-emphasis">توضیحات کامل:</strong>
          <p class="mt-1 text-justify">{{ invoice.description }}</p>
        </div>
      </v-card-text>
    </div>
  </v-card>
</template>

<style scoped>
/* Clean card styling with soft border */
.invoice-card {
  transition: all 0.15s ease;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.invoice-card:hover {
  border-color: rgba(0, 0, 0, 0.2) !important;
}

/* Smooth slide animation for details */
.details-container {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
}

.details-container.details-visible {
  max-height: 150px;
  opacity: 1;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease 0.1s;
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
.invoice-card .v-btn,
.invoice-card .v-chip,
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

.invoice-card .v-btn {
  font-weight: 500 !important;
  text-transform: none !important;
  letter-spacing: 0.25px !important;
}

.invoice-card .v-chip {
  font-weight: 500 !important;
}
</style>