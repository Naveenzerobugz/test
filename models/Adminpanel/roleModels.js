const mongoose=require('mongoose');
var Schema=new mongoose.Schema({
    rolename: {
        type: String
    },
    description:{
        type: String
    },
    companyid: {
        type: Number
    },
    createdby: {
        type: Number,default: '' 
    },
    createddate: {
        type: Date,default: Date.now 
    },
    updatedby: {
        type: Number,default: ''
    },
    updateddate: {
        type: Date,default: ''
    },
    isdeleted: {
        type: Number,default: 0
    },
})
var Role=new mongoose.model('Role', Schema);
module.exports=Role;