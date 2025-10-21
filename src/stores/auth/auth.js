import { defineStore } from 'pinia'
export const Stores_Auth = defineStore('auth',{

    state : ()=>({
        user : null,
        token : null
    }),

    actions : {
        AuthLoginRequest(params){
            return new Promise((resolve, reject) => {
                this.$axios.post('users/auth/login',params).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        AuthLogin(user,token){
            this.user = user;
            this.token = token
            localStorage.setItem('crm_users_token', token)
            localStorage.setItem('crm_users_user', JSON.stringify(user));
        },

        AuthSyncData(){
            if (localStorage.getItem('crm_users_token')){
                this.token = localStorage.getItem('crm_users_token');
            }
            if (localStorage.getItem('crm_users_user')){
                this.user = JSON.parse(localStorage.getItem('crm_users_user'));
            }
        },
        async AuthLogout(){
            // Clear localStorage
            localStorage.removeItem('crm_users_token');
            localStorage.removeItem('crm_users_user');
            localStorage.clear();
            
            // Clear sessionStorage
            sessionStorage.clear();
            
            // Clear all service worker caches
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
            }
            
            // Unregister service workers
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(registrations.map(reg => reg.unregister()));
            }
            
            // Reset store state
            this.user = null;
            this.token = null;
            
            // Redirect and reload
            window.location.href = '/auth';
        }
    },

    getters :{
        AuthGetUser(){
            return this.user;
        },
        AuthGetToken(){
            return this.token;
        },
        AuthGetCheckAuth(){
            return !!this.token;
        }




    }

})