import { createRouter, createWebHistory } from 'vue-router'
import Auth_Routes from "@/router/auth/auth.js";
import {Stores_Auth} from "@/stores/auth/auth.js";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      ...Auth_Routes,

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
