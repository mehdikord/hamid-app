
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
import notifyInstance from "@/mixin/helpers/notify.js";
import App from './App.vue'
import router from './router'
import {Stores_Auth} from "@/stores/auth/auth.js";
import Swal from 'sweetalert2';
import validations from "@/mixin/helpers/validations.js";
import helpers from "@/mixin/helpers/helpers.js";

const notify = {
    install(app) {
        app.config.globalProperties.$swal = Swal.mixin();
    }
};

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
// Globals Components
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import Global_No_Items from "@/components/global/Global_No_Items.vue";
import Actions_Customer_Status from "@/components/actions/Actions_Customer_Status.vue";
import Action_Customer_Report_Create from "@/components/actions/Action_Customer_Report_Create.vue";
import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker'
import Global_Validation_Errors from "@/components/global/Global_Validation_Errors.vue";
import Action_Customer_Invoice_Create from "@/components/actions/Action_Customer_Invoice_Create.vue";
import Action_Data_Table_Pagination from "@/components/actions/data/Action_Data_Table_Pagination.vue";

app.component('DatePicker', Vue3PersianDatetimePicker)
app.component('no_items',Global_No_Items)
app.component('actions_customer_status',Actions_Customer_Status)
app.component('actions_customer_report_create',Action_Customer_Report_Create)
app.component('actions_customer_invoice_create',Action_Customer_Invoice_Create)
app.component('actions_data_pagination',Action_Data_Table_Pagination)
app.component('validation_errors',Global_Validation_Errors)











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
app.use(notify)
app.mixin(notifyInstance)
app.mixin(validations)
app.mixin(helpers)
app.mount('#app')
