import { defineStore } from 'pinia'

export const Stores_Invoices = defineStore('invoices', {
    actions: {
        Index(params) {
            return new Promise((resolve, reject) => {
                this.$axios.get('users/invoices', { params: params }).then(response => {
                    return resolve(response);
                }).catch(error => {
                    return reject(error);
                })
            })
        },
        Chart_Data(params) {
            return new Promise((resolve, reject) => {
                this.$axios.get('users/reporting/invoices', { params: params }).then(response => {
                    return resolve(response);
                }).catch(error => {
                    return reject(error);
                })
            })
        },
    },
})

