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
        AuthLogout(){
            localStorage.removeItem('crm_users_token');
            localStorage.removeItem('crm_users_user');
            window.location.reload();
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