const mongoose = require('mongoose');
var SalesDetailSchema = new mongoose.Schema({
    productname: {
        type: String
    },
    rate:{
        type:Number
    },
    qty:{
        type:Number
    }
});
var SalesEntrySchema = new mongoose.Schema({
    Entrydate: {
        type: String
    },
    description:{
        type:Number
    },
    customername:{
        type:String
    },
    saledetail:{
        type:[SalesDetailSchema]
    }

});


var SalesEntry = new mongoose.model('SalesEntry', SalesEntrySchema);
module.exports = SalesEntry;
