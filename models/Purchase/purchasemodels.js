const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var PurchaseDetailSchema = new mongoose.Schema({
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
    }

});
var SupplierDetail = new mongoose.Schema({
    suppliername: {
        type: String
    },
    suppliertype: {
        type: String
    },
    email: {
        type: String
    },
    shippingaddress: {
        type: String
    },
    billingaddress: {
        type: String
    },
    gstin: {
        type: String
    },
    gsttype: {
        type: String
    },
    gstno: {
        type: String
    }
})
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
    purchaseorderno: {
        type: String
    },
    purchasedate: {
        type: Date
    },
    creditdays: {
        type: Number
    },
    reference: {
        type: String
    },
    supplierid: {
        type: ObjectId
    },
    gstdetail: {
        type: [GstDetialschema]
    },
    purchaseDetail: {
        type: [PurchaseDetailSchema]
    },
    SupplierDetail: {
        type: [SupplierDetail]
    },
    subtotal: {
        type: Number
    },
    actualtotal: {
        type: Number
    },
    roundofftype: {
        type: String
    },
    roundoff: {
        type: Number
    },
    total: {
        type: Number
    },

    isdeleted: {
        type: Number,
        default: 0
    },
    hsncolumn: {
        type: Number,
        default: 0
    },
    unitcolumn: {
        type: Number,
        default: 0
    },
    discountcolumn: {
        type: Number,
        default: 0
    },
    discountype: {
        type: String
    },
    taxtype: {
        type: String
    },
    companyid: {
        type: ObjectId
    },
    createdby: {
        type: ObjectId
    },
    createddate: {
        type: Date,
        default: Date.now
    },
    updatedby: {
        type: ObjectId
    },
    updateddate: {
        type: Date,
        default: ''
    },

})
var Purchase = new mongoose.model('Purchase', Schema);
module.exports = Purchase;