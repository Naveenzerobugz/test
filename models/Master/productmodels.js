const mongoose=require('mongoose');
var ObjectId=require('mongodb').ObjectID;
var Schema=new mongoose.Schema({
    productname:{
        type:String
    },
    itemcode:{
        type:String
    },
    unitid:{
        type:ObjectId
    },
    type:{
        type:String
    },
    taxinclusive:{
        type:String
    },
    salesprice:{
        type:Number
    },
    purchaseprice:{
        type:Number
    },
    mrp:{
        type:Number
    },
    taxid:{
        type:ObjectId
    },
    hsnorsac_code:{
        type:String
    },
    categoryid:{
        type:ObjectId
    },
    subcategoryid:{
        type:ObjectId
    },
    minimumstock:{
        type:Number
    },
    openingstock:{
        type:Number
    } ,
    stockinhand:{
        type:Number
    } ,
    branchid: {
        type: ObjectId
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

var MasterProduct=new mongoose.model('MasterProduct', Schema);
module.exports=MasterProduct;