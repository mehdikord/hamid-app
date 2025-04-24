import { defineStore } from 'pinia'
export const Stores_Statuses = defineStore('statuses',{

    actions : {
        All(params){
            return new Promise((resolve, reject) => {
                this.$axios.get('users/customers/statuses',{params : params}).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

    },


})