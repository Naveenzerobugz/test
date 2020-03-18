const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var Schema = new mongoose.Schema({

    category: {
        type: String
    },

    description: {
        type: String
    },
    branchid: {
        type: ObjectId
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
})

var category = new mongoose.model('category', Schema);
module.exports = category;