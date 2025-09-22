<script>
export default {
  name: "Action_Data_Table_Pagination",
  props:{
    data:{
      type:Object,
      required:true
    }
  },
  data(){
    return {
      show_items:[15,25,50,100,200],
      pagination: this.data,
    }
  },
  computed: {
    totalVisiblePages() {
      // For mobile devices, show fewer pages to prevent overflow
      if (this.$vuetify.display.smAndDown) {
        // On mobile, show maximum 5 pages to fit screen
        return Math.min(5, this.pagination.last_page);
      } else if (this.$vuetify.display.mdAndDown) {
        // On tablet, show maximum 7 pages
        return Math.min(7, this.pagination.last_page);
      } else {
        // On desktop, show maximum 10 pages
        return Math.min(10, this.pagination.last_page);
      }
    }
  },
  methods:{
    Change_PerPage(){
      this.$emit('PerPageChange',this.pagination.per_page);
    },
    Change_Page(){
      this.$emit('ChangePage',this.pagination.current);
    }
  }
}
</script>

<template>

  <div v-if="pagination">
    <!-- Mobile Layout: Stacked vertically -->
    <div v-if="$vuetify.display.smAndDown" class="mobile-pagination">
      <v-row class="mb-3 mx-0">
        <v-col cols="12" class="py-0 px-2">
          <v-select
              :items="show_items"
              rounded
              v-model="pagination.per_page"
              color="deep-orange-darken-2"
              label="تعداد داده در صفحه"
              variant="outlined"
              density="compact"
              @update:model-value="Change_PerPage"
              class="mobile-select"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row class="mx-0">
        <v-col cols="12" class="py-0 px-0">
          <v-pagination
              class="mobile-pagination-controls"
              active-color="deep-orange-darken-3"
              :length="pagination.last_page"
              density="compact"
              variant="text"
              :total-visible="totalVisiblePages"
              rounded="rounded"
              v-model="pagination.current"
              @update:model-value="Change_Page"
          ></v-pagination>
        </v-col>
      </v-row>
    </div>

    <!-- Desktop Layout: Side by side -->
    <v-row v-else>
      <v-col md="4" class="py-0">
        <v-select
            :items="show_items"
            rounded
            v-model="pagination.per_page"
            color="deep-orange-darken-2"
            label="تعداد داده در صفحه"
            variant="outlined"
            density="comfortable"
            @update:model-value="Change_PerPage"
        >
        </v-select>
      </v-col>
      <v-col md="8" class="py-0 pb-4">
        <v-pagination
            class="float-start"
            active-color="deep-orange-darken-3"
            :length="pagination.last_page"
            density="comfortable"
            variant="text"
            :total-visible="totalVisiblePages"
            rounded="rounded"
            v-model="pagination.current"
            @update:model-value="Change_Page"
        ></v-pagination>
      </v-col>
    </v-row>
  </div>

</template>

<style scoped>
/* Mobile pagination layout */
.mobile-pagination {
  padding: 0;
  margin: 0 -8px; /* Extend to full width by compensating for parent padding */
}

.mobile-select {
  width: 100% !important;
}

.mobile-select :deep(.v-field) {
  font-size: 14px !important;
  min-height: 44px !important;
}

.mobile-select :deep(.v-field__input) {
  padding: 12px 16px !important;
}

.mobile-pagination-controls {
  justify-content: center !important;
  width: 100% !important;
  padding: 0 12px !important; /* Minimal padding for touch targets */
  margin: 0 !important;
}

.mobile-pagination-controls .v-pagination__item {
  min-width: 36px !important;
  height: 36px !important;
  font-size: 13px !important;
  margin: 0 2px !important;
}

.mobile-pagination-controls .v-pagination__prev,
.mobile-pagination-controls .v-pagination__next {
  min-width: 36px !important;
  height: 36px !important;
  margin: 0 2px !important;
}

/* Desktop pagination improvements */
@media (min-width: 961px) {
  .v-pagination {
    justify-content: flex-start !important;
  }
  
  .v-pagination .v-pagination__item {
    min-width: 40px !important;
    height: 40px !important;
    font-size: 14px !important;
  }
  
  .v-pagination .v-pagination__prev,
  .v-pagination .v-pagination__next {
    min-width: 40px !important;
    height: 40px !important;
  }
}

/* Tablet pagination improvements */
@media (min-width: 601px) and (max-width: 960px) {
  .v-pagination {
    justify-content: center !important;
  }
  
  .v-pagination .v-pagination__item {
    min-width: 38px !important;
    height: 38px !important;
    font-size: 13px !important;
  }
  
  .v-pagination .v-pagination__prev,
  .v-pagination .v-pagination__next {
    min-width: 38px !important;
    height: 38px !important;
  }
}

/* Ensure pagination doesn't overflow on small screens */
.v-pagination {
  flex-wrap: wrap !important;
  gap: 2px !important;
}

/* Better spacing for all screen sizes */
.v-col {
  padding: 8px !important;
}

/* Improved select styling for better UX */
.v-select {
  transition: all 0.3s ease !important;
}

.v-select:focus-within {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15) !important;
}

/* Mobile-specific improvements */
@media (max-width: 600px) {
  .mobile-pagination {
    padding: 0;
    margin: 0 -4px; /* Compensate for smaller parent padding */
  }
  
  .mobile-select {
    margin: 0 4px; /* Add small margin for visual separation */
  }
  
  .mobile-select :deep(.v-field) {
    font-size: 13px !important;
    min-height: 40px !important;
  }
  
  .mobile-select :deep(.v-field__input) {
    padding: 10px 14px !important;
  }
  
  .mobile-pagination-controls {
    padding: 0 4px !important; /* Minimal padding for smaller screens */
    margin: 0 !important;
  }
  
  .mobile-pagination-controls .v-pagination__item {
    min-width: 32px !important;
    height: 32px !important;
    font-size: 12px !important;
    margin: 0 1px !important; /* Tighter spacing for more buttons */
  }
  
  .mobile-pagination-controls .v-pagination__prev,
  .mobile-pagination-controls .v-pagination__next {
    min-width: 32px !important;
    height: 32px !important;
    margin: 0 1px !important;
  }
}
</style>