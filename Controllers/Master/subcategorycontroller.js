const mongoose = require('mongoose');

var subcategory = mongoose.model('subcategory');

require("datejs");
require('../../config/logger');
var url = require('url');


module.exports = {


    insert(req, res) {


        if (req.body._id) {
            subcategory.findById(req.body._id

                ).then((data) => {

                    data.updateOne({

                            category: req.body.category,
                            subcategory: req.body.subcategory,
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
            console.log(req.body.category)
            subcategory.findOne({ isdeleted: 0, category: req.body.category, subcategory:{ "$regex" :req.body.subcategory , "$options" : "i"}  })
                .then((data) => {
                    if (!data) {
                        subcategory.create({

                                category: req.body.category,
                                subcategory: req.body.subcategory,
                                description: req.body.description,
                                branchid: req.session.branchid,
                                companyid: req.session.companyid,
                                createdby: req.session.usrid,
                                createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),

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
                            })

                    } else {
                        res.status(400).send('subcategory name is already used')
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
                orderby = { $sort: { subcategory: -1 } };
            }
            else {
                orderby = { $sort: { subcategory: 1 } };
            }
        }else if (urlparms['order[0][column]'] == '2') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { description: -1 } };
            }
            else {
                orderby = { $sort: { description: 1 } };
            }
        }
        console.log(orderby);
         var searchStr = urlparms['search[value]'];
         if (urlparms['search[value]']) {
             var regex = new RegExp(urlparms['search[value]'], "i")
             searchStr = {
                 $match: {
                     $or: [
                         // { '_id': regex },
                         { 'subcategory': regex },
                         { 'description': regex },
                         { 'categoriesdata.category': regex },
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
        subcategory.count({ isdeleted: 0 }, function(err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            subcategory.count({isdeleted:0}, function(err, c) {
                recordsFiltered = c;
                console.log('record fliter count ' + c);
                console.log('start ' + urlparms.start);
                console.log('length ' + urlparms.length);
                subcategory.aggregate(
                    [searchStr,
                        orderby,
                        {
                            $lookup: {
                                from: "categories",
                                "localField": "category",
                                "foreignField": "_id",
                                as: "categoriesdata"
                            }
                        },
                        {
                            $unwind: "$categoriesdata"
                        },
                        {
                            $project: {
                                "_id": 1,
                                "subcategory": 1,
                                "description": 1,
                                "categoriesdata.category": 1

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


    edit(req, res) {
        console.log(req.params._id)
        subcategory.findById(req.params._id).then((data) => {
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

        subcategory.findById(req.params._id)
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
    dropdown(req, res) {
        subcategory.aggregate([{
                    $match: { "isdeleted": 0, "category": new mongoose.Types.ObjectId(req.params.categoryid) }
                },
                {
                    $project: {
                        id: '$_id',
                        name: "$subcategory"
                    }
                }
            ])
            .then((data) => { res.status(200).send({ data: data }); })
            .catch((error) => res.status(400).send(error));
    },
}