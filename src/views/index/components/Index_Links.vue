<script>
export default {
  name: "Index_Links",

}
</script>

<template>
  <v-row>
    <v-col cols="12" lg="6" xl="6" class="mt-1">
      <router-link :to="{name : 'customers_consultant'}">
        <v-row class="box">
        <v-col cols="5" lg="4">
          <img src="@/assets/images/icons/counseling.svg" class="image" alt="">
        </v-col>
        <v-col cols="7" lg="8">
          <div class="mt-3">
            <strong class="text-black">مشاوره</strong>
          </div>
          <div class="mt-2 text-grey-darken-2">
            لیست شماره های در حال مشاوره
          </div>
        </v-col>
      </v-row>
      </router-link>
    </v-col>
    <v-col cols="12" lg="6" xl="6" class="mt-1">
      <router-link :to="{name : 'customers_seller'}">
        <v-row class="box">
          <v-col cols="5" lg="4">
            <img src="@/assets/images/icons/sale-team.svg" class="image" alt="">
          </v-col>
          <v-col cols="7" lg="8">
            <div class="mt-3">
              <strong class="text-black">فروش</strong>
            </div>
            <div class="mt-2 text-grey-darken-2">
              لیست شماره های در حال فروش
            </div>
          </v-col>
        </v-row>
      </router-link>
    </v-col>
  </v-row>
</template>

<style scoped>
.box{
  padding: 2px 2px;
  border: solid 1px rgba(0,0,0,0.08);
  background-color:rgba(0,0,0,0.03);
  border-radius: 10px;
}
.image{
  width: 230px;
  height: 130px;
}
@media screen and (max-width: 600px) {

  .image{
    width: 160px;
    height: 90px;
  }
}


</style>