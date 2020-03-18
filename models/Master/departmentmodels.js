const mongoose=require('mongoose');
var ObjectId=require('mongodb').ObjectID;
var Schema=new mongoose.Schema({
    deptname:{
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
var MasterDepartment=new mongoose.model('MasterDepartment', Schema);
module.exports=MasterDepartment;