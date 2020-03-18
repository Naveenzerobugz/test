const mongoose=require('mongoose');
var ObjectId=require('mongodb').ObjectID;
var Schema=new mongoose.Schema({
    taxname:{
        type:String
    },
    sgst:{
       type:Number
    },
    cgst:{
        type:Number
     },
     igst:{
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
var MasterTax=new mongoose.model('MasterTax', Schema);
module.exports=MasterTax;