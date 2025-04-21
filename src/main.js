
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import '@/assets/css/font.css'
import '@/assets/css/colors.css'
import moment from "moment-jalaali";
import axiosInstance from "@/mixin/axios/axios";
import App from './App.vue'
import router from './router'
import {Stores_Auth} from "@/stores/auth/auth.js";

const app = createApp(App)
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
    },

})
app.config.globalProperties.$axios = axiosInstance;
const pinia = createPinia()
pinia.use(({ store }) => {
    store.$axios = axiosInstance;
});
window.moment = moment;


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Globals Filters
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.config.globalProperties.$filters={

    date_jalali(value,format='jYYYY/jM/jD  H:m:s'){
        return moment(value).format(format);
    },

    number_format(value){
        if (value){
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },

}


app.config.globalProperties.$axios = axiosInstance;
app.use(pinia)
Stores_Auth().AuthSyncData();
app.use(router)
app.use(vuetify)
app.mount('#app')
