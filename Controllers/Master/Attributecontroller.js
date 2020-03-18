const mongoose = require('mongoose');
var Masterattribute = mongoose.model('Masterattribute');
require("datejs");
require('../../config/logger');
var url = require('url');
module.exports = {
    insert(req, res) {

        if (req.body._id) {
            Masterattribute.findById(req.body._id)
                .then((data) => {
                    if (!data) {
                        return res.status(400).send({
                            status: 'error',
                            messag: 'Data is Not availble'
                        })
                    } else {
                        data.updateOne({
                                attributename: req.body.attributename,
                                type: req.body.type,
                                categoryid: req.body.categoryid,
                                branchid: req.session.branchid || data.branchid,
                                companyid: req.session.companyid || data.companyid,
                                updatedby: req.session.usrid || data.userid,
                                updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                                isdeleted: '0'
                            })
                            .then((data1) => {
                                logger.log('info', 'logjson{ page : MasterAttribute, Acion : update,Process : Success,_id:' + req.body._id + ',userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                                res.status(200).send({
                                    status: 'success',
                                    message: 'Record Update SuccessFully'
                                })
                            })
                    }
                })
        } else {
            console.log('---Insert process----')
            Masterattribute.findOne({ isdeleted: 0,  categoryid: req.body.categoryid, attributename:{ "$regex" :req.body.attributename , "$options" : "i"}  })
                .then((data) => {
                    if (!data) {
                        Masterattribute.create({
                                attributename: req.body.attributename,
                                type: req.body.type,
                                categoryid: req.body.categoryid,
                                // dropdownvalue:req.body.dropdownvalue==""?[]:JSON.parse(req.body.dropdownvalue),
                                branchid: req.session.branchid,
                                companyid: req.session.companyid,
                                createdby: req.session.usrid,
                                createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                                isdeleted: '0'
                            }).then((data) => {
                                logger.log('info', 'logjson{ page : MasterAttribute, Acion : Insert,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
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
                        req.status(400).send('Attribute Name Already used')
                    }
                })


        }

    },
    list(req, res) {
        console.log(req.url);
        var queryString = url.parse(req.url, true);
        var urlparms = queryString.query;var orderby = {};
        if (urlparms['order[0][column]'] == '0') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { _id: -1 } };
            }
            else {
                orderby = { $sort: { _id: 1 } };
            }
        } else if (urlparms['order[0][column]'] == '1') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { attributename: -1 } };
            }
            else {
                orderby = { $sort: { attributename: 1 } };
            }
        }else if (urlparms['order[0][column]'] == '2') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { type: -1 } };
            }
            else {
                orderby = { $sort: { type: 1 } };
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
                         { 'attributename': regex },
                         { 'type': regex },
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
        Masterattribute.count({ isdeleted: 0 }, function(err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            Masterattribute.count({isdeleted:0}, function(err, c) {
                recordsFiltered = c;
                console.log('record fliter count ' + c);
                console.log('start ' + urlparms.start);
                console.log('length ' + urlparms.length);
                Masterattribute.aggregate([
                        searchStr,
                        orderby,
                        {
                            $project: {
                                "_id": 1,
                                "attributename": 1,
                                "type": 1

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

        Masterattribute.findById({ isdeleted: 0, _id: req.params._id })
            .then((data) => {
                return res.status(200).send(data)
            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    deleterecord(req, res) {

        Masterattribute.findById(req.params._id)
            .then(data => {
                if (!data) {
                    return res.status(404).send({
                        message: 'Data Not Found',
                    });
                }
                return data.updateOne({
                        isdeleted: 1
                    })
                    .then((data1) => res.status(200).send({ status: 'success', message: 'Record deleted SuccessFully', data1 }))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

}