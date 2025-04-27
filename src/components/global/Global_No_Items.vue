<script>
export default {
  name: "Global_No_Items",
  props: {
    text: {
      type: String,
      default: 'هیچ آیتمی یافت نشد !'
    },
    width: {
      type: String,
      default: '260'
    }
  },
}
</script>

<template>

  <div class="text-center mt-5 mb-5 animate__animated animate__bounceInDown">
    <img src="@/assets/images/icons/no-items.svg" :width="width" alt="">
    <div class="mt-2">
      <strong class="text-red">{{text}}</strong>
    </div>
  </div>

</template>

<style scoped>

</style>