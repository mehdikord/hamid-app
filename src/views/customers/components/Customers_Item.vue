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
      <v-card-item >
        <img src="@/assets/images/icons/customer.svg" class="customer-profile" alt="">
      </v-card-item>
    </v-card>
  </template>


</template>

<style scoped>
.customer-profile{
  width: 65px;
}
</style>