const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var Schema = new mongoose.Schema({
    expansename: {
        type: String
    },
    description: {
        type: String
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
var masterexpanse = new mongoose.model('masterexpanse', Schema);
module.exports = masterexpanse;