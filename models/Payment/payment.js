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

    billno: {
        type: String
    },
    billdate: {
        type: Date
    },
    paidfrom: {
        type: ObjectId
    },
    type: {
        type: String
    },
    typeid: {
        type: ObjectId
    },
    // customerid: {
    //     type: ObjectId
    // },
    // supplierid: {
    //     type: ObjectId
    // },
    referencemode: {
        type: String
    },
    reference: {
        type: String
    },
    paidamount: {
        type: Number
    },

    trans_id: {
        type: ObjectId
    },
    trans_no: {
        type: String, default: ''
    },
    trans_date: {
        type: Date, default:  Date.now
    },
   
    balance: {
        type: Number, default: 0
    },
    payedamount: {
        type: Number, default: 0
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
        type: ObjectId ,
    },
    updateddate: {
        type: Date, default: Date.now
    },
    isdeleted: {
        type: Number, default: 0
    },
    note:{
        type: String
    }
})
var Payment = new mongoose.model('Payment', Schema);
module.exports = Payment;