const mongoose=require('mongoose');
var ObjectId=require('mongodb').ObjectID;
var DropDownSchema = new mongoose.Schema({
   value: {
        type: String
    }
   
});
var Schema=new mongoose.Schema({
    attributename:{
        type:String
    },
    type:{
        type:String
    },
    categoryid:{
        type:ObjectId
    },
    dropdownvalue:{
        type:[DropDownSchema]
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
var Masterattribute=new mongoose.model('Masterattribute', Schema);
module.exports=Masterattribute;