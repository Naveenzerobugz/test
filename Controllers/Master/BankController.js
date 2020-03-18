const mongoose = require('mongoose');
var Bank = mongoose.model('MasterBank');
require("datejs");
require('../../config/logger');
var url = require('url');
module.exports = {
    insert(req, res) {
        console.log(req.body._id)
        if(req.body._id)
        {
            Bank.findById(req.body._id)
            .then((data)=>{
                if(!data){
                    return res.status(400).send({
                        status:'error',messag:'Data is Not availble'
                    })
                }
                else{
                    data.updateOne({
                        bankname: req.body.bankname||data.bankname,
                        branchname: req.body.branchname||data.branchname,
                        accountno:req.body.accountno||data.accountno,
                        ifsc_code: req.body.ifsc_code||data.ifsc_code,
                        address: req.body.address||data.address,
                        branchname: req.body.branchname||data.branchname,
                        openingbalance:req.body.openingbalance||data.openingbalance,
                        description:req.body.description||data.description,
                        companyid: req.session.companyid||data.companyid,
                        updatedby: req.session.usrid||data.userid,
                        updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                        isdeleted: '0'
                    })
                    .then((data1)=>{
                        logger.log('info','logjson{ page : MasterBank, Acion : update,Process : Success,_id:'+req.body._id+',userid : '+req.session.usrid+',companyid :'+ req.session.companyid+',datetime: '+(new Date()).toString("yyyy-MM-dd HH:MM:ss"+'}'));
                        res.status(200).send({
                            status:'success', message : 'Record Update SuccessFully'
                           })
                    })
                }
            })
        }
        else
        {
            console.log('---Insert process----')
            console.log(req.body.bankname)
            Bank.findOne({isdeleted:0,bankname:req.body.bankname,branchname:req.body.branchname,ifsc_code:req.body.ifsc_code,accountno:req.body.accountno})
            .then((data)=>{
               
                if(data)
                {
                    res.status(400).send('Bankname is already Used')
                }
                else
                {
                    Bank.create({
                        bankname: req.body.bankname,
                        branchname: req.body.branchname,
                        ifsc_code: req.body.ifsc_code,
                        address: req.body.address,
                       
                        openingbalance:req.body.openingbalance,
                        description:req.body.description,
                        accountno:req.body.accountno,
                        companyid: req.session.companyid,
                        createdby: req.session.usrid,
                        createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                        isdeleted: '0'
                    }).then((data) => {
                        logger.log('info','logjson{ page : MasterBank, Acion : Insert,Process : Success,userid : '+req.session.usrid+',companyid :'+ req.session.companyid+',datetime: '+(new Date()).toString("yyyy-MM-dd HH:MM:ss"+'}'));
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
    ddllist(req,res){
        Bank.find({
            companyid: '5e2ae65bc0814f3e04a7f61f',isdeleted: '0'
        },
        {
            _id:1, bankname:1
        })
        .then((data) => {           
            return res.status(200).send({data:data})
        })
        .catch((error) => {
            return res.status(400).send(error)
        })
    },
    list(req, res) {
        console.log(req.url);
        var queryString = url.parse(req.url, true);
        var urlparms = queryString.query;

        var orderby = {};
        if (urlparms['order[0][column]'] == '0') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { _id: -1 } };
            }
            else {
                orderby = { $sort: { _id: 1 } };
            }
        } else if (urlparms['order[0][column]'] == '1') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { bankname: -1 } };
            }
            else {
                orderby = { $sort: { bankname: 1 } };
            }
        }else if (urlparms['order[0][column]'] == '2') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { branchname: -1 } };
            }
            else {
                orderby = { $sort: { branchname: 1 } };
            }
        }else if (urlparms['order[0][column]'] == '3') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { ifsc_code: -1 } };
            }
            else {
                orderby = { $sort: { ifsc_code: 1 } };
            }
        }
        else if (urlparms['order[0][column]'] == '4') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { accountno: -1 } };
            }
            else {
                orderby = { $sort: { accountno: 1 } };
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
                         { 'bankname': regex },
                         { 'branchname': regex },
                         { 'ifsc_code': regex },
                         { 'accountno': regex },
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
        Bank.count({isdeleted : 0 }, function (err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            Bank.count({isdeleted:0}, function (err, c) {
                recordsFiltered = c;
                console.log('record fliter count ' + c);
                console.log('start ' + urlparms.start);
                console.log('length ' + urlparms.length);
                Bank.aggregate(
                    [
                        searchStr,
                        orderby,
                        {
                            $project: {
                                "_id": 1,
                                "bankname": 1,
                                "branchname": 1,
                                "ifsc_code": 1,
                                "accountno":1
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
                        // var totalrecord={
                        //     total:recordsFiltered
                        // }
                        //  results.push(totalrecord)
                        // console.log(results)
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
   
        Bank.findById(
            { isdeleted: 0, _id: req.params._id },
            '_id bankname branchname ifsc_code accountno address openingbalance description'
        )
            .then((data) => {
                return res.status(200).send(data)
            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    deleterecord(req,res){
     
        Bank.findById(req.params._id)
        .then(data=>{
              if (!data) {
                return res.status(404).send({
                message: 'Data Not Found',
                });
            }
           return data.updateOne({
            isdeleted:1
           })
           .then((data1) => res.status(200).send({status:'success', message : 'Record deleted SuccessFully',data1}))
           .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error));
    },
}
