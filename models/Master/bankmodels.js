const mongoose=require('mongoose');
var ObjectId=require('mongodb').ObjectID;
var Schema=new mongoose.Schema({
    bankname:{
        type:String
    },
    branchname:{
        type:String
    },
    ifsc_code:{
        type:String
    },
    accountno:{
        type:Number
    },
    address:{
        type:String
    },
    openingbalance:{
        type:Number
    },
    description:{
        type:String
    },
    companyid: {
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
var MasterBank=new mongoose.model('MasterBank', Schema);
module.exports=MasterBank;