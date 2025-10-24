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
        //Seller
        Index_Seller(params){
            return new Promise((resolve, reject) => {
                this.$axios.get('users/customers/seller',{params : params}).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

        //Consultant
        Index_Consultant(params){
            return new Promise((resolve, reject) => {
                this.$axios.get('users/customers/consultant',{params : params}).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Index_Consultant_Old(params){
            return new Promise((resolve, reject) => {
                this.$axios.get('users/customers/consultant/old',{params : params}).then(response =>{
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
                if(params.status_id){data.append('status_id',params.status_id);}
                if(params.project_level_id){data.append('project_level_id',params.project_level_id);}
                if(params.file){data.append('file',params.file,params.file.name);}
                if(params.date){data.append('date',params.date);}
                if(params.messages){data.append('messages',JSON.stringify(params.messages));}
                
                this.$axios.post('users/customers/'+params.customer_id+'/reports',data,{
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

        Reports_Latest(params){

            return new Promise((resolve, reject) => {
                this.$axios.get('users/customers/'+params.id+'/reports/latest').then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Reports_Index(params){

            return new Promise((resolve, reject) => {
                this.$axios.get('users/customers/'+params.id+'/reports',{params : params}).then(response =>{
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

        Invoices_Latest(params){

            return new Promise((resolve, reject) => {
                this.$axios.get('users/customers/'+params.id+'/invoices/latest').then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },
        Invoices_Index(params){
            return new Promise((resolve, reject) => {
                this.$axios.get('users/customers/'+params.id+'/invoices',{params : params}).then(response =>{
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
        },

        Projects_Index(params){

            return new Promise((resolve, reject) => {
                this.$axios.get('users/customers/'+params.id+'/projects').then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

        Projects_Own(params){

            return new Promise((resolve, reject) => {
                this.$axios.get('users/customers/'+params.customer_id+'/projects/own/'+params.project_id).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

        Projects_Reports_Store(params){
            return new Promise((resolve, reject) => {

                let data = new FormData();
                if(params.report){data.append('report',params.report);}
                if(params.status_id){data.append('status_id',params.status_id);}
                if(params.project_level_id){data.append('project_level_id',params.project_level_id);}
                if(params.file){data.append('file',params.file,params.file.name);}
                if(params.date){data.append('date',params.date);}
                if(params.messages){data.append('messages',JSON.stringify(params.messages));}
                
                this.$axios.post('users/customers/'+params.customer_id+'/projects/'+params.project_id+'/reports',data,{
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })

        },

        Projects_Invoices_Store(params){
            return new Promise((resolve, reject) => {
                let data = new FormData();
                if(params.price){data.append('price',params.price);}
                if(params.file){data.append('file',params.file,params.file.name);}
                if(params.date){data.append('date',params.date);}
                if(params.description){data.append('description',params.description);}
                this.$axios.post('users/customers/'+params.customer_id+'/projects/'+params.project_id+'/invoices',data,{
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })

        },

        Projects_Fields(params){

            return new Promise((resolve, reject) => {
                this.$axios.get('users/customers/'+params.id+'/projects/fields/'+params.project_id).then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

        Projects_Levels(params){
            return new Promise((resolve, reject) => {
                this.$axios.get('users/projects/'+params.project_id+'/levels').then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

        Levels_All(params){
            return new Promise((resolve, reject) => {
                this.$axios.get('users/projects/'+params.project_id+'/levels').then(response =>{
                    return resolve(response);
                }).catch(error =>{
                    return reject(error);
                })
            })
        },

    },


})