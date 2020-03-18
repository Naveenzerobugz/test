const mongoose=require('mongoose');
var Tax=mongoose.model('MasterTax');
require("datejs");
require('../../config/logger');
var url = require('url');
module.exports={
    insert(req, res) {
      
        if(req.body._id)
        {
            Tax.findById(req.body._id)
            .then((data)=>{
                if(!data){
                    return res.status(400).send({
                        status:'error',messag:'Data is Not availble'
                    })
                }
                else{
                    data.updateOne({
                        taxname: req.body.taxname.toUpperCase(),
                        sgst: req.body.sgst||data.sgst,
                        cgst:req.body.cgst||data.cgst,
                        igst: req.body.igst||data.igst,
                        description: req.body.description||data.description,
                        companyid: req.session.companyid||data.companyid,
                        updatedby: req.session.usrid||data.userid,
                        updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                        isdeleted: '0'
                    })
                    .then((data1)=>{
                        logger.log('info','logjson{ page : MasterTax, Acion : update,Process : Success,_id:'+req.body._id+',userid : '+req.session.usrid+',companyid :'+ req.session.companyid+',datetime: '+(new Date()).toString("yyyy-MM-dd HH:MM:ss"+'}'));
                        res.status(200).send({
                            status:'success', message : 'Record Update SuccessFully'
                           })
                    })
                }
            })
        }
        else
        {
            Tax.findOne({isdeleted:0, taxname: req.body.taxname.toUpperCase()})
            .then((data)=>{
                if(data)
                {
                    res.status(400).send('taxname is already used')
                }
                else
                {
                    Tax.create({
                        taxname: req.body.taxname.toUpperCase(),
                        sgst: req.body.sgst,
                        cgst:req.body.cgst,
                        igst: req.body.igst,
                        description: req.body.description,
                        companyid: req.session.companyid,
                        createdby: req.session.userid,
                        createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                        isdeleted: '0'
                    }).then((data) => {
                        logger.log('info','logjson{ page : MasterTax, Acion : Insert,Process : Success,userid : '+req.session.userid+',companyid :'+ req.session.companyid+',datetime: '+(new Date()).toString("yyyy-MM-dd HH:MM:ss"+'}'));
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
            })
          
        }
     
    },
    list(req, res) {
        var queryString = url.parse(req.url, true);
        var urlparms = queryString.query;
        // console.log(urlparms);
        var orderby = {};
        if (urlparms['order[0][column]'] == '0') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { _id: -1 } };
            }
            else {
                orderby = { $sort: { _id: 1 } };
            }
        }
        else if (urlparms['order[0][column]'] == '1') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { taxname: -1 } };
            }
            else {
                orderby = { $sort: { taxname: 1 } };
            }
        } else if (urlparms['order[0][column]'] == '2') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { sgst: -1 } };
            }
            else {
                orderby = { $sort: { sgst: 1 } };
            }
        }else if (urlparms['order[0][column]'] == '3') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { cgst: -1 } };
            }
            else {
                orderby = { $sort: { cgst: 1 } };
            }
        }else if (urlparms['order[0][column]'] == '4') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { igst: -1 } };
            }
            else {
                orderby = { $sort: { igst: 1 } };
            }
        }
        
        //  console.log(urlparms);
         console.log(orderby);
         var searchStr = urlparms['search[value]'];
         if (urlparms['search[value]']) {
             var regex = new RegExp(urlparms['search[value]'], "i")
             searchStr = {
                 $match: {
                     $or: [
                         // { '_id': regex },
                         { 'taxname': regex },
                         { 'sgst': regex },
                         { 'cgst': regex },
                         { 'igst': regex },
                     ],
                     isdeleted: 0,
                    //  companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    //  branchid: new mongoose.Types.ObjectId(req.session.branchid)
                 }
 
             };
         } else {
             searchStr = {
                 $match: {
                     isdeleted: 0,
                    //  companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    //  branchid: new mongoose.Types.ObjectId(req.session.branchid)
                 }
             };
         }
         console.log(searchStr)
        var recordsTotal = 0;
        var recordsFiltered = 0;
        Tax.count({isdeleted : 0 }, function (err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            Tax.count({isdeleted:0}, function (err, c) {
                recordsFiltered = c;
                // console.log('record fliter count ' + c);
                // console.log('start ' + urlparms.start);
                // console.log('length ' + urlparms.length);
                Tax.aggregate(
                    [
                        searchStr,
                        orderby,
                        {
                            $project: {
                                "_id": 1,
                                "taxname": 1,
                                "sgst": 1,
                                "cgst": 1,
                                "igst":1
                           }
                        },                       
                        { "$skip": Number(urlparms.start), },
                        { "$limit": Number(urlparms.length) },
                    ],
                    function (err, results) {
                        if (err) {
                            console.log('error while getting results' + err);
                            return;
                        }
                        // console.log(results)
                        var data = JSON.stringify({
                            "draw": urlparms.draw,
                            "recordsFiltered": recordsFiltered,
                            "recordsTotal": recordsTotal,
                            "data": results
                        });
                        // console.log(data)
                        res.send(data);
                    })
            })
        })

    },
    edit(req, res) {

        Tax.findById(
            { isdeleted: 0, _id: req.params._id },
            '_id taxname sgst cgst igst description'
        )
            .then((data) => {
                  if(!data){
                    return res.status(404).send({
                        message: 'Data Not Found',
                        });
                  }
                return res.status(200).send(data);
            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    deleterecord(req,res){
        console.log(req.params._id);
        Tax.findById(req.params._id)
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
    dropdownlist(req, res) {
        Tax.aggregate([
            {
                $match: { "isdeleted": 0 }
            },
            {
                $project: {
                    id: '$_id',
                    name: "$taxname"
                }
            }
        ])
            .then((data) => { res.status(200).send({ data: data }); })
            .catch((error) => res.status(400).send(error));
    },
}