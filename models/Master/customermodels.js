const mongoose=require('mongoose');
var ObjectId=require('mongodb').ObjectID;
var Schema=new mongoose.Schema({
    
    name: {
        type: String
    },
    mobile: {
        type: String
    },
    openingbalance: {
        type: String,default: '0.00'
    },
    paymentterms: {
        type: String,default: ''
    },
    customertype: {
        type: String,default: ''
    },
    companyname: {
        type: String,default: ''
    },
    email: {
        type: String,default: ''
    },
    others: {
        type: String,default: ''
    },
    description: {
        type: String,default: ''
    },
    gsttype: {
        type: String,default: ''
    },
    gstin: {
        type: String,default: ''
    },
    panno: {
        type: String,default: ''
    },
    billingaddress: {
        type: String,default: ''
    },
    billingstate: {
        type: String,default: ''
    },
    billingpincode: {
        type: String,default: ''
    },
    shippingaddress: {
        type: String,default: ''
    },
    shippingstate: {
        type: String,default: ''
    },
    shippingpincode: {
        type: String,default: ''
    },
    
    companyid: {
        type: ObjectId
    },
    branchid: {
        type: ObjectId
    },
    createdby: {
        type:ObjectId 
    },
    createddate: {
        type: Date,default: Date.now 
    },
    updatedby: {
        type:ObjectId
    },
    updateddate: {
        type: Date,default: ''
    },
    isdeleted: {
        type: Number,default: 0
    },
})
var mastercustomer=new mongoose.model('mastercustomer', Schema);
module.exports=mastercustomer;