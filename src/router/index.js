import { createRouter, createWebHistory } from 'vue-router'
import Auth_Routes from "@/router/auth/auth.js";
import Index_Routes from "@/router/index/index.js";
import Profile_Routes from "@/router/profile/profile.js";
import Customers_Routes from "@/router/customers/customers.js";
import Reports_Routes from "@/router/reports/reports.js";
import {Stores_Auth} from "@/stores/auth/auth.js";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      ...Auth_Routes,
      ...Index_Routes,
      ...Profile_Routes,
      ...Customers_Routes,
      ...Reports_Routes,

  ],
})
router.beforeEach((to, from, next) => {
    // trying to access a restricted page + not logged in
    // redirect to login page
    if (to.path !== '/auth' && !Stores_Auth().AuthGetCheckAuth) {
        next('/auth');
    }else if (to.path === '/auth' && Stores_Auth().AuthGetCheckAuth){
        next('/');
    }
    else {
        next();
    }
});
export default router
