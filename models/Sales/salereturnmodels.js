const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var InvoiceRetailDetailSchema = new mongoose.Schema({
    productid: {
        type: ObjectId
    },
    qty: {
        type: Number
    },
    rate: {
        type: Number
    },
    discount: {
        type: Number
    },
    amount: {
        type: Number
    },
    unitid: {
        type: ObjectId
    },
    hsn: {
        type: Number
    },
    invoicedetail_id:{
        type: ObjectId
    },
    saleqty:{
        type:Number
    }

});
var GstDetialschema=new mongoose.Schema({
    name: {
        type: String
    },
    percentage: {
        type: String
    },
    sgst: {
        type: String
    },
    cgst: {
        type: String
    },
})
var Schema = new mongoose.Schema({
    invoicereturn_no: {
        type: String
    },
    invoiceno:{
        type: String
    },
    invoicedate: {
        type: Date
    },
    sale_id:{
        type:ObjectId
    },
    // duedate: {
    //     type: Date
    // },
    // creditdays: {
    //     type:Number
    // },
    reference: {
        type: String
    },
  
    customerid: {
        type: ObjectId
    },
    invoiceReturnDetail: {
        type: [InvoiceRetailDetailSchema]
    },
    gstdetail: {
        type: [GstDetialschema]
    },
    subtotal: {
        type: Number
    },
    roundoff: {
        type: Number
    },
    total: {
        type: Number
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
   modifiedby: {
        type: ObjectId
    },
   modifieddate: {
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
    hsncolumn:{
        type: Number, default: 0
    },
    unitcolumn:{
        type: Number, default: 0
    },
    discountcolumn:{
        type: Number, default: 0
    },
    discountype:{
        type:String
    },
    taxtype:{
        type:String
    },
    salesrep:{
        type:ObjectId
    }

})
var SaleReturn = new mongoose.model('SaleReturn', Schema);
module.exports = SaleReturn;