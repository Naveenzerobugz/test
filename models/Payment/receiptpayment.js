const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
// var PaymentDeatilschema=new mongoose.schema({
//     paidamount:{
//         type:Number
//     },
//     purchase_id: {
//         type: ObjectId
//     },
//     payment: {
//         type: Number
//     },
  
//     balance: {
//         type: Number
//     },
//     payedamount:{
//         type: Number
//     },
// })

var Schema = new mongoose.Schema({

    receiptno: {
        type: String
    },
    receiptdate: {
        type: Date
    },
   
    paidfrom:{
        type: ObjectId
    },
    customerid: {
        type: ObjectId
    },
    referencemode:{
        type: String
    },
    reference:{
        type: String
    },
    paidamount:{
        type:Number
    },
   sale_id: {
        type: ObjectId
    },
    invoiceno: {
        type: String
    },
    invoicedate: {
        type: Date,
    },
    payment: {
        type: Number
    },
    balance: {
        type: Number
    },
    payedamount:{
        type: Number,
    },
    companyid: {
        type: ObjectId
    },
    branchid: {
        type: ObjectId
    },
    createdby: {
        type: ObjectId
    },
    createddate: {
        type: Date, default: Date.now
    },
    updatedby: {
        type: ObjectId
    },
    updateddate: {
        type: Date, default: ''
    },
    isdeleted: {
        type: Number, default: 0
    },
   

})
var ReceiptPayment = new mongoose.model('ReceiptPayment', Schema);
module.exports = ReceiptPayment;