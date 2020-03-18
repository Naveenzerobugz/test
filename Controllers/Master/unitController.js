const mongoose = require('mongoose');

var unit = mongoose.model('unit');

require("datejs");
require('../../config/logger');
var url = require('url');


module.exports = {
    
    
    insert(req, res) {
        console.log(req.body.description);
        

       if(req.body._id)
       {
        unit.findById(req.body._id
           
            ).then((data) => {
               
                    data.updateOne({
                        unitname: req.body.unitname,
                        description: req.body.description,
                        isdeleted: '0'

                    }).then((data1) => {
                        res.status(200).send({
        
                            status: 'success',
                            message: 'record update successfully'
                        })
                    })
                    .catch((error) => {
                            res.status(400).send({
                                status: 'Error',
                                message: error
                            })
                        }
                    )
            })
            .catch((error) => {
                    res.status(400).send({
                        status: 'Error',
                        message: error
                    })
                }
            )
       }
       else
       {
        unit.create({
            
            
            unitname: req.body.unitname,
            description: req.body.description,
            
            }).then((data) => {
                res.status(200).send({
                    
                    status: 'success',
                    message: 'record added successfully'
                })
            })
            .catch((error) => {
                    res.status(400).send({
                        status: 'Error',
                        message: error
                    })
                }
            )
       }
     
    },
    
    list(req, res) {
        unit.find({isdeleted:0
              
            }).then((data) => {
                res.status(200).send({
                    data:data
                }
                 
                  
                )
            })
            .catch((error) => {
                    res.status(400).send({
                        status: 'Error',
                        message: error
                    })
                }
            )
    },
  
    edit(req, res) {
        console.log(req.params._id)
        unit.findById(req.params._id
            ).then((data) => {
                res.status(200).send(
                    data
                  
                )
            })
            .catch((error) => {
                    res.status(400).send({
                        status: 'Error',
                        message: error
                    })
                }
            )
    },

   
    deleterecord(req,res){
     
        unit.findById(req.params._id)
        .then(data=>{
              if (!data) {
                return res.status(404).send({
                message: 'Data Not Found',
                });
            }
           return data.updateOne({
            isdeleted:1
           })
           .then((data1) => res.status(200).send({status:'Success', message : 'Record deleted SuccessFully',data1}))
           .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error));
    },
    dropdown(req,res)
    {
       // db.users.aggregate()
       unit.aggregate([
            {
                $match:{"isdeleted":0}
            },
            {
               
                $project:
                {
                    name:"$unitname",
                   id:"$_id"
                }
            }])
        .then((data)=>{
            if(!data)
            {
                return res.status(400).send('Data is Not availble');
            }
            res.status(200).send({ data: data })
        })
        .catch((error)=>{
            return res.status(400).send(error);
        })
    }
}