const mongoose = require('mongoose');
var Department = mongoose.model('MasterDepartment');
require("datejs");
require('../../config/logger');
var url = require('url');
module.exports = {
    insert(req, res) {

        if (req.body._id) {
            Department.findById(req.body._id)
                .then((data) => {
                    if (!data) {
                        return res.status(400).send({
                            status: 'error', messag: 'Data is Not availble'
                        })
                    }
                    else {
                        data.updateOne({
                            deptname: req.body.deptname || data.deptname,
                            description: req.body.description || data.description,
                            companyid: req.session.companyid || data.companyid,
                            updatedby: req.session.usrid || data.usrid,
                            updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                            isdeleted: '0'
                        })
                            .then((data1) => {
                                logger.log('info', 'logjson{ page : MasterDepartment, Acion : update,Process : Success,_id:' + req.body._id + ',userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                                res.status(200).send({
                                    status: 'success', message: 'Record Update SuccessFully'
                                })
                            })
                    }
                })
        }
        else {
            Department.findOne({ isdeleted: 0,  productname:{ "$regex" : req.body.productname , "$options" : "i"}  })
                .then((data) => {
                    if (data) {
                        res.status(400).send('department name is already used')
                    }
                    else {
                        Department.create({
                            deptname: req.body.deptname,
                            description: req.body.description,
                            companyid: req.session.companyid,
                            createdby: req.session.usrid,
                            createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                            isdeleted: '0'
                        }).then((data) => {
                            logger.log('info', 'logjson{ page : MasterDepartment, Acion : Insert,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
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
        } else if (urlparms['order[0][column]'] == '1') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { deptname: -1 } };
            }
            else {
                orderby = { $sort: { deptname: 1 } };
            }
        } else if (urlparms['order[0][column]'] == '2') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { description: -1 } };
            }
            else {
                orderby = { $sort: { description: 1 } };
            }
        }
        var searchStr = urlparms['search[value]'];
         if (urlparms['search[value]']) {
             var regex = new RegExp(urlparms['search[value]'], "i")
             searchStr = {
                 $match: {
                     $or: [
                         // { '_id': regex },
                         { 'deptname': regex },
                       
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
        var recordsTotal = 0;
        var recordsFiltered = 0;
        Department.count({ isdeleted: 0 }, function (err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            Department.count({isdeleted:0}, function (err, c) {
                recordsFiltered = c;
                // console.log('record fliter count ' + c);
                // console.log('start ' + urlparms.start);
                // console.log('length ' + urlparms.length);
                Department.aggregate(
                    [
                        searchStr,
                        orderby,
                        {
                            $project: {
                                "_id": 1,
                                "deptname": 1,
                                "description": 1
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

        Department.findById(
            { isdeleted: 0, _id: req.params._id },
            '_id deptname description'
        )
            .then((data) => {
                if (!data) {
                    return res.status(404).send({
                        message: 'Data Not Found',
                    });
                }
                return res.status(200).send(data)
            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    deleterecord(req, res) {
        Department.findById(req.params._id)
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
        // db.users.aggregate()
        Department.aggregate([
            {
                $match: { "isdeleted": 0 }
            },
            {
                $project:
                {
                    name: "$deptname",
                    id: "$_id"
                }
            }])
            .then((data) => {
                if (!data) {
                    return res.status(400).send('Data is Not availble');
                }
                res.status(200).send({ data: data })
            })
            .catch((error) => {
                return res.status(400).send(error);
            })
    }
}