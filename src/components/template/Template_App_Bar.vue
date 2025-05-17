<script>
import {Stores_Auth} from "@/stores/auth/auth.js";

export default {
  name: "Template_App_Bar",
  data() {
    return {
      user: Stores_Auth().AuthGetUser,
      time: '',
      date: '',
      timer: null,
      drawer: true,
    }
  },

  methods: {
    updateClock() {
      const now = new Date();
      // استخراج و فرمت زمان
      let hours = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      this.time = `${hours}:${minutes}:${seconds}`;

      this.date = moment().format('jYYYY/jM/jD');
    }
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  mounted() {
    this.updateClock();
    this.timer = setInterval(this.updateClock, 1000);
  },

}
</script>

<template>

  <v-app-bar :elevation="0" class="color-dark-bg">
    <v-icon icon="mdi-account ms-3 font-40" color="deep-orange"></v-icon>
    <v-app-bar-title>
      <strong class="text-grey-lighten-4">
        {{ user.name }}
      </strong>
    </v-app-bar-title>



    <template v-slot:append>
      <div class="me-3 hidden-xs">
        <v-btn icon="mdi-magnify font-32" color="deep-orange"></v-btn>
        <v-btn icon="mdi-heart font-32" color="deep-orange"></v-btn>
        <span class="text-dark">
          <strong class=" text-white">{{date}}</strong>
          <strong class="text-white ma-2">-</strong>
          <strong class="text-white">{{time}}</strong>
          <v-icon icon="mdi-calendar font-30" color="deep-orange" class="ms-1"></v-icon>
        </span>
      </div>



    </template>

  </v-app-bar>

</template>

<style scoped>

</style>