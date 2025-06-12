import { defineStore } from 'pinia'
export const Stores_Projects = defineStore('projects',{

    actions : {
        All(){
            return new Promise((resolve, reject) => {
                this.$axios.get('users/projects/all').then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

    },


})