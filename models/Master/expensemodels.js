
var ObjectId = require('mongodb').ObjectID;
var expansedetailschema = new mongoose.Schema({
    expanseid: {
        type: ObjectId
    },
    expesename: {
        type: String
    },
    expensedesc:{
        type:String
    },
    amount:{
        type:Number
    }
});
var Schema = new mongoose.Schema({
    entrydate: {
        type: Date
    },
    entrydatenormal: {
        type: String
    },
    paymode: {
        type: ObjectId
    },
    refrensemode: {
        type: String
    },
    refrensedesc: {
        type: String
    },
    description: {
        type: String
    },
    uploadfile: {
        type: String
    },
    totalamt: {
        type: Number
    },
    expansedetail: {
        type:[expansedetailschema]
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
    updatedby: {
        type: ObjectId
    },
    updateddate: {
        type: Date, default: ''
    },
    isdeleted: {
        type: Number, default: 0
    },
})
var expense = new mongoose.model('expense', Schema);
module.exports = expense;