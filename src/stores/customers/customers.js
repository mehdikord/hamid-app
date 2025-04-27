import { defineStore } from 'pinia'
export const Stores_Customer = defineStore('customers',{

    actions : {
        Index(params){
            return new Promise((resolve, reject) => {
                this.$axios.get('users/customers',{params : params}).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Statuses_Store(params){
            return new Promise((resolve, reject) => {
                this.$axios.post('users/customers/'+params.customer_id+'/statuses',params).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        }

    },


})