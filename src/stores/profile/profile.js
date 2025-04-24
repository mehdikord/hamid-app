import { defineStore } from 'pinia'
export const Stores_Profile = defineStore('profile',{

    actions : {
        Profile(){
            return new Promise((resolve, reject) => {
                this.$axios.get('users/profile').then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

    },


})