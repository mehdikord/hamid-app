<script>
export default {
  name: "Customers_Item",
  props: {
    customer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {

    }
  },
  methods: {

  },
  mounted() {

  }
}
</script>

<template>

  <template v-if="customer">
    <v-card flat border rounded>
      <v-card-item class="pa-6">
        <v-row>
          <v-col md="3" cols="12">
            <v-icon icon="mdi-account font-44" color="deep-orange-darken-3"></v-icon>
            <strong class="font-15">{{ customer.customer.phone}}</strong>
            <template v-if="customer.customer.name">
              <span class="ms-1">( {{customer.customer.name}} )</span>
            </template>
          </v-col>
          <v-col md="1" cols="12">
            <actions_customer_status @Changed="(item) => this.$emit('Emit_Change_Status',item)" :customer="customer"></actions_customer_status>
          </v-col>
          <v-col md="2" cols="12">
            <div class="mt-2">
              <span>پروژه : </span>
              <strong>{{ customer.project.name }}</strong>
            </div>
          </v-col>
          <v-col md="2" cols="12">
            <div class="mt-2">
              <span>
                <span>فاکتورها : </span>
                <strong class="text-blue-darken-2 font-17">15</strong>
              </span>
              <span class="ms-5">
                <span>گزارشات : </span>
                <strong class="text-teal font-17">15</strong>
              </span>

            </div>
          </v-col>
          <v-col md="2" cols="12">
            <div class="mt-2">
            </div>
          </v-col>
          <v-col class="text-end mt-2" md="2" cols="12">
            <v-btn color="teal" variant="flat" rounded append-icon="mdi-text-box-edit">ثبت گزارش</v-btn>
            <v-btn class="ms-2" color="blue-darken-2" variant="flat" rounded append-icon="mdi-currency-usd">ثبت فاکتور</v-btn>
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>
  </template>


</template>

<style scoped>
.customer-profile{
  width: 65px;
}
</style>