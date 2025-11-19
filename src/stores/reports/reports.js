import { defineStore } from 'pinia'

export const Stores_Reports = defineStore('reports', {
    actions: {
        Index(params) {
            return new Promise((resolve, reject) => {
                this.$axios.get('users/reports', { params: params }).then(response => {
                    return resolve(response);
                }).catch(error => {
                    return reject(error);
                })
            })
        },
    },
})

