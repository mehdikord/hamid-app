import { defineStore } from 'pinia'
import {da} from "vuetify/locale";
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
        Show(params){
            return new Promise((resolve, reject) => {
                this.$axios.get('users/customers/'+params.id,).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Edit(params){
            return new Promise((resolve, reject) => {
                this.$axios.put('users/customers/'+params.id,params).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

        //Statuses
        Statuses_Store(params){
            return new Promise((resolve, reject) => {
                this.$axios.post('users/customers/'+params.customer_id+'/statuses',params).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

        //Reports
        Reports_Store(params){
            return new Promise((resolve, reject) => {

                let data = new FormData();
                if(params.report){data.append('report',params.report);}
                if(params.file){data.append('file',params.file,params.file.name);}
                if(params.date){data.append('date',params.date);}
                this.$axios.post('users/customers/'+params.customer_id+'/reports',data,{
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

        //Invoices

        Invoices_Store(params){
            return new Promise((resolve, reject) => {

                let data = new FormData();
                if(params.price){data.append('price',params.price);}
                if(params.file){data.append('file',params.file,params.file.name);}
                if(params.date){data.append('date',params.date);}
                if(params.description){data.append('description',params.description);}
                this.$axios.post('users/customers/'+params.customer_id+'/invoices',data,{
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })

            })
        },

        Invoices_Target_Price(params){
            return new Promise((resolve, reject) => {
                this.$axios.post('users/customers/'+params.customer_id+'/invoices/target',params).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        }


    },


})