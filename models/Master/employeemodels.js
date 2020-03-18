const mongoose=require('mongoose');
var ObjectId=require('mongodb').ObjectID;
var Schema=new mongoose.Schema({
    empname:{
        type:String
    },
    deptid:{
       type:ObjectId
    },
    doj:{
        type:Date
    },
    salary:{
        type:Number
     },
     incentives:{
        type:Number
     },
     others:{
        type:String
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
var MasterEmployee=new mongoose.model('MasterEmployee', Schema);
module.exports=MasterEmployee;