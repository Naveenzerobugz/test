const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var Schema=new mongoose.Schema({
    companyname: {
        type: String
    },
    gstno: {
        type: String
    },
    panno: {
        type: String
    },

    address: {
        type: String
    },
    pincode: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
   
    telephoneno: {
        type: String
    },
    mobile: {
        type: String
    },
    email: {
        type: String
    },
    bankname: {
        type: String
    },
    branchname: {
        type: String
    },
   
    accountholdername: {
        type: String
    },
    accountnumber: {
        type: String
    },
    ifsccode: {
        type: String
    },
    billcode: {
        type: String
    },
    companyweblogo: {
        type: String
    },
    companymobilelogo: {
        type: String
    },
    companyreportlogo: {
        type: String
    },
    isdeleted:{
        type:Number,default:0
    },
    createdby:
    {
        type: Number
    },
    createddate:
    {
        type:Date,default:Date.now
    },
    updatedby:
    {
        type: Number
    },
    updateddate:
    {
        type:Date,
    },
    type:{
        type:String
    },
    creditdays:{
        type:Number
    },
    companyid:{
        type:ObjectId
    }
})

var Branch=new mongoose.model('Branch',Schema);
module.exports=Branch;