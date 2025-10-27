<script >
export default {
  name : "Template_Menu",
  props:['user']
}
</script>

<template>
  <v-list-item
  >
    <template v-slot:prepend>
      <v-avatar >
        <img src="/src/assets/images/icons/profile.svg" width="100%" alt="">
      </v-avatar>
    </template>
    <template v-slot:title>
      <strong class="font-16">{{ user.name }}</strong>
    </template>
    <template v-slot:subtitle>
      <div class="font-13 mt-1">{{ user.phone }}</div>
    </template>
  </v-list-item>
  <v-divider class="mb-2"/>
  <v-list-item
      :to="{name : 'index'}"
      active-color="deep-orange-darken-2"
  >
    <template v-slot:prepend>
      <v-icon icon="mdi mdi-view-dashboard-variant" size="30">
      </v-icon>
    </template>
    <template v-slot:title>
      <div class="mt-1">
        <span class="font-14">داشبورد</span>
      </div>
    </template>
  </v-list-item>
  <v-spacer class="mt-2 mb-2" />
  <v-list-item
      :to="{name : 'customers_consultant'}"
      active-color="deep-orange-darken-2"
  >
    <template v-slot:prepend>
      <v-icon icon="mdi mdi-face-agent" size="30" >
      </v-icon>
    </template>
    <template v-slot:title>
      <div class="mt-1">
        <span class="font-14">مشاوره</span>
      </div>
    </template>
  </v-list-item>
  <v-spacer class="mt-2 mb-2" />
  <v-list-item
      :to="{name : 'customers_seller'}"
      active-color="deep-orange-darken-2"

  >
    <template v-slot:prepend>
      <v-icon icon="mdi mdi-account-voice" size="30" >
      </v-icon>
    </template>
    <template v-slot:title>
      <div class="mt-1">
        <span class="font-14">فروش</span>
      </div>
    </template>
  </v-list-item>
  <v-spacer class="mt-2 mb-2" />
  <v-list-item
      :to="{name : 'reports'}"
      active-color="deep-orange-darken-2"
  >
    <template v-slot:prepend>
      <v-icon icon="mdi mdi-notebook-edit" size="30">
      </v-icon>
    </template>
    <template v-slot:title>
      <div class="mt-1">
        <span class="font-14">گزارشات</span>
      </div>
    </template>
  </v-list-item>
  <v-spacer class="mt-2 mb-2" />
  <v-list-item
      :to="{name : 'reminders'}"
      active-color="deep-orange-darken-2"
  >
    <template v-slot:prepend>
      <v-icon icon="mdi mdi-bell-outline" size="30">
      </v-icon>
    </template>
    <template v-slot:title>
      <div class="mt-1">
        <span class="font-14">یاداور ها</span>
      </div>
    </template>
  </v-list-item>
  <v-spacer class="mt-2 mb-2" />
  <!-- <v-list-item
      active-color="deep-orange-darken-2"

  >
    <template v-slot:prepend>
      <v-icon icon="mdi mdi-currency-usd" size="30">
      </v-icon>
    </template>
    <template v-slot:title>
      <div class="mt-1">
        <span class="font-14">فاکتور ها </span>
      </div>
    </template>
  </v-list-item>
  <v-spacer class="mt-2 mb-2" />
  <v-list-item
      active-color="deep-orange-darken-2"
  >
    <template v-slot:prepend>
      <v-icon icon="mdi mdi-currency-usd" size="30" >
      </v-icon>
    </template>
    <template v-slot:title>
      <div class="mt-1">
        <span class="font-14">فاکتور ها </span>
      </div>
    </template>
  </v-list-item> -->
  <!-- <v-spacer class="mt-2 mb-2" />
  <v-list-item
      active-color="deep-orange-darken-2"
  >
    <template v-slot:prepend>
      <v-icon icon="mdi mdi-account-group" size="30" >
      </v-icon>
    </template>
    <template v-slot:title>
      <div class="mt-1">
        <span class="font-14">شماره ها </span>
      </div>
    </template>
  </v-list-item> -->
  <v-spacer class="mt-2 mb-2" />
  <v-list-item
      :to="{name : 'profile'}"
      active-color="deep-orange-darken-2"
  >
    <template v-slot:prepend>
      <v-icon icon="mdi mdi-cogs" size="30">
      </v-icon>
    </template>
    <template v-slot:title>
      <div class="mt-1">
        <span class="font-14">تنظیمات</span>
      </div>
    </template>
  </v-list-item>

</template>

<style scoped>

</style>