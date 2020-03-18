const mongoose=require('mongoose');

var Schema=new mongoose.Schema({

    unitname:{
        type:String
    },

    description:{
        type:String
    },

    isdeleted: {
        type: Number,default: 0
    },
})

var unit=new mongoose.model('unit', Schema);
module.exports=unit;