const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var PurchaseReturnDetailSchema = new mongoose.Schema({
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
    purchasedetail_id: {
        type: ObjectId
    },
    purchaseqty: {
        type: Number
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
var Schema = new mongoose.Schema({
    purchasereturnno: {
        type: String
    },
    purchase_id: {
        type: ObjectId
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
    SupplierDetail: {
        type: [SupplierDetail]
    },
    purchaseRetrunDetail: {
        type: [PurchaseReturnDetailSchema]
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
    }

})
var PurchaseReturn = new mongoose.model('PurchaseReturn', Schema);
module.exports = PurchaseReturn;