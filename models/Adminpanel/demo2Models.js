var mongoose=require('mongoose');

var Schema=new mongoose.Schema({
    sku:{
        type:String
    },
    description:{
        type:String
    },
    instock:{
        type:String
    }
})

var Demo2=new mongoose.model('Demo2', Schema);
module.exports=Demo2;