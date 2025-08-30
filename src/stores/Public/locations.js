import { defineStore } from 'pinia'
export const Stores_Locations = defineStore('locations',{

    actions : {
        Provinces(){
            return new Promise((resolve, reject) => {
                this.$axios.get('api/provinces').then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

    },


})