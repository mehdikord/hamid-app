<script>
export default {
  name: "Global_Validation_Errors",
  props:['errors'],
}
</script>

<template>

  <ul v-if="errors">

    <li v-for="error in errors"><small class="text-red">{{error}}</small></li>

  </ul>
</template>

<style scoped lang="scss">

</style>