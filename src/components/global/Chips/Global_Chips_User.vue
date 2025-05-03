<script>
export default {
  name: "Global_Chips_User",
  props:['user']
}
</script>

<template>
  <v-chip v-if="user" density="comfortable" color="deep-orange-darken-3"  prepend-icon="mdi-account font-24">
    <strong class="mt-1 text-black">{{ user.name }}</strong>
  </v-chip>
</template>

<style scoped>

</style>