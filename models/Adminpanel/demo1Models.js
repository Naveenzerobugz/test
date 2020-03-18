var mongoose=require('mongoose');

var Schema=new mongoose.Schema({
    item:{
        type:String
    },
    price:{
        type:String
    },
    quantity:{
        type:String
    }
})

var Demo1=new mongoose.model('Demo1', Schema);
module.exports=Demo1;