const mongoose = require('mongoose');
var MasterCompany = mongoose.model('MasterCompany');

module.exports = {
    add(req,res){
       
      
        MasterCompany.create({
            companyname:req.body.companyname,
            email:req.body.email,
            mobile:req.body.mobile,
            address:req.body.address,
            city:req.body.city,
            gender:'male'
        })
        .then(data=>res.status(200).send({status:'Success',message:'record added successfully',data}))
        .catch(error=>res.status(400).send(error))
    },
    list(req,res)
    {
        MasterCompany.find()
        .then(data=>res.status(200).send(data))
        .catch(error=>res.status(400).send(error))
    },
    update(req,res)
    {
  
        MasterCompany.findById(req.params.id)
        .then(data=>{
              if (!data) {
                return res.status(404).send({
                message: 'Company Not Found',
                });
            }
           return data.updateOne({
            email:req.body.email
           })
           .then((data1) => res.status(200).send({status:'Success', message : 'Record Update SuccessFully',data1}))
           .catch((error) => res.status(400).send(error));
        })
        .catch(error=>res.status(400).send({status:'error',message:error}))
    }
    
};
