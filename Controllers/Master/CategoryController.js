const mongoose = require('mongoose');

var category = mongoose.model('category');
var subcategory = mongoose.model('subcategory');
require("datejs");
require('../../config/logger');
var url = require('url');


module.exports = {

    insert(req, res) {
        console.log(req.body.category);
        if (req.body._id) {
            category.findById(req.body._id

                ).then((data) => {

                    data.updateOne({
                            category: req.body.category.toLowerCase(),
                            description: req.body.description,
                            branchid: req.session.branchid || data.branchid,
                            companyid: req.session.companyid || data.companyid,
                            updatedby: req.session.usrid || data.userid,
                            updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
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
                        })
                })
                .catch((error) => {
                    res.status(400).send({
                        status: 'Error',
                        message: error
                    })
                })
        } else {
            category.findOne({ isdeleted: 0, category:req.body.category.toLowerCase()   })
                .then((data) => {
                    if (!data) {
                      return  category.create({
                                category: req.body.category .toLowerCase(),
                                description: req.body.description,
                                branchid: req.session.branchid,
                                companyid: req.session.companyid,
                                createdby: req.session.usrid,
                                createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                            }).then((data) => {
                                return subcategory.create({
                                    category: data._id,
                                    subcategory: "not applicable",
                                    description: "not applicable",
                                    branchid: req.session.branchid,
                                    companyid: req.session.companyid,
                                    createdby: req.session.usrid,
                                    createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
    
                                }).then((data) => {
                                    return res.status(200).send({    
                                        status: 'success',
                                        message: 'record added successfully'
                                    })
                                })
                                .catch((error) => {
                                    res.status(400).send({
                                        status: 'Error',
                                        message: error
                                    })
                                })                                
                            })
                            .catch((error) => {
                                res.status(400).send({
                                    status: 'Error',
                                    message: error
                                })
                            })
                    } else {
                        res.status(400).send('Category Name Already used')
                    }
                })

        }

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
                orderby = { $sort: { category: -1 } };
            }
            else {
                orderby = { $sort: { category: 1 } };
            }
        }else if (urlparms['order[0][column]'] == '2') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { description: -1 } };
            }
            else {
                orderby = { $sort: { description: 1 } };
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
                         { 'category': regex },
                         { 'description': regex },
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
        category.count({ isdeleted: 0 }, function(err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            category.count({isdeleted:0}, function(err, c) {
                recordsFiltered = c;
                console.log('record fliter count ' + c);
                console.log('start ' + urlparms.start);
                console.log('length ' + urlparms.length);
                category.aggregate(
                    [
                        searchStr,
                        orderby,
                        {
                            $project: {
                                "_id": 1,
                                "category": 1,
                                "description": 1,

                            }
                        },
                        { "$skip": Number(urlparms.start), },
                        { "$limit": Number(urlparms.length) },
                    ],
                    function(err, results) {

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

    dropdownlist(req, res) {
        category.aggregate([{
                    $match: { "isdeleted": 0 }
                },
                {
                    $project: {
                        id: '$_id',
                        name: "$category"
                    }
                }
            ])
            .then((data) => { res.status(200).send({ data: data }); })
            .catch((error) => res.status(400).send(error));
    },
    edit(req, res) {
        console.log(req.params._id)
        category.findById(req.params._id).then((data) => {
                res.status(200).send(
                    data

                )
            })
            .catch((error) => {
                res.status(400).send({
                    status: 'Error',
                    message: error
                })
            })
    },


    deleterecord(req, res) {

        category.findById(req.params._id)
            .then(data => {
                if (!data) {
                    return res.status(404).send({
                        message: 'Data Not Found',
                    });
                }
                return data.updateOne({
                        isdeleted: 1
                    })
                    .then((data1) => res.status(200).send({ status: 'Success', message: 'Record deleted SuccessFully', data1 }))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },
}