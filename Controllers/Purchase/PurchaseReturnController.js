var PurchaseReturn = mongoose.model('PurchaseReturn');
var Purchase = mongoose.model('Purchase');
var Product = mongoose.model('MasterProduct');
var each = require('promise-each');
require("datejs");
require('../../config/logger');
module.exports = {
    insert(req, res) {
        if (!req.body._id) {
            Purchase.findById(req.body.purchase_id)
                .then((data) => {
                    if (!data) {
                        return res.status(404).send({
                            message: 'Data Not Found',
                        });
                    } else {
                        Promise.resolve(req.body.purchaseRetrunDetail).then(each((update) =>
                            data.purchaseDetail.forEach((old) => {
                                if (old._id == update.purchasedetail_id) {
                                    Product.findById(update.productid)
                                        .then((productdata) => {
                                            if (!productdata) {
                                                return res.status(404).send({
                                                    message: 'Data Not Found',
                                                });
                                            }
                                            productdata.updateOne({
                                                stockinhand: (parseInt(productdata.stockinhand) - parseInt(old.qty)) + parseInt(update.qty)
                                            }).then((data1) => { })
                                        })
                                }

                            })
                        ))

                        PurchaseReturn.create({
                            purchasereturnno: req.body.purchasereturnno,
                            purchase_id: req.body.purchase_id,
                            purchasedate: req.body.purchasedate,
                            creditdays: req.body.creditdays,
                            reference: req.body.reference,
                            supplierid: req.body.supplierid,
                            subtotal: req.body.subtotal,
                            roundoff: req.body.roundoff,
                            roundofftype: req.body.roundofftype,
                            actualtotal: req.body.actualtotal,
                            gstdetail: req.body.gstdetail,
                            total: req.body.total,
                            SupplierDetail: req.body.SupplierDetail,
                            purchaseRetrunDetail: req.body.purchaseRetrunDetail,
                            hsncolumn: req.body.hsncolumn,
                            unitcolumn: req.body.unitcolumn,
                            discountcolumn: req.body.discountcolumn,
                            discountype: req.body.discountype,
                            taxtype: req.body.taxtype,
                            companyid: req.session.companyid,
                            createdby: req.session.usrid,
                            createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                            isdeleted: '0'
                        }).then((data) => {
                            logger.log('info', 'logjson{ page : purchaesReurn, Acion : Insert,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                            res.status(200).send({
                                status: 'success',
                                message: 'record added successfully',
                            })
                        })
                            .catch((error) => res.status(400).send({ status: 'Error', message: error }))
                    }


                })
                .catch((err) => res.status(400).send(err))
        } else {

            PurchaseReturn.findById(req.body._id)
                .then(data => {
                    if (!data) {
                        return res.status(404).send({
                            message: 'Data Not Found',
                        });
                    }
                    Promise.resolve(req.body.purchaseRetrunDetail).then(each((pr) =>
                        data.purchaseRetrunDetail.forEach((old) => {
                            if (old.purchasedetail_id = pr.purchasedetail_id) {
                                Product.findById(pr.productid)
                                    .then((data5) => {
                                        data5.updateOne({
                                            stockinhand: (parseInt(data5.stockinhand) + parseInt(old.qty)) - parseInt(pr.qty)
                                        }).then((data7) => { })
                                    })
                            }
                        })
                    ))

                    data.updateOne({
                        purchasereturnno: req.body.purchasereturnno,
                        purchase_id: req.body.purchase_id,
                        purchasedate: req.body.purchasedate,
                        creditdays: req.body.creditdays,
                        reference: req.body.reference,
                        supplierid: req.body.supplierid,
                        subtotal: req.body.subtotal,
                        roundoff: req.body.roundoff,
                        roundofftype: req.body.roundofftype,
                        actualtotal: req.body.actualtotal,
                        gstdetail: req.body.gstdetail,
                        total: req.body.total,
                        purchaseRetrunDetail: req.body.purchaseRetrunDetail,
                        SupplierDetail: req.body.SupplierDetail,
                        hsncolumn: req.body.hsncolumn,
                        unitcolumn: req.body.unitcolumn,
                        discountcolumn: req.body.discountcolumn,
                        discountype: req.body.discountype,
                        taxtype: req.body.taxtype,
                        companyid: req.session.companyid,
                        updatedby: req.session.usrid,
                        updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                        isdeleted: '0'
                    })
                        .then((data2) => { res.status(200).send({ status: 'success', message: 'Record Updated success' }) })
                        .catch((err) => res.status(400).send(err))


                })

        }
    },
    list(req, res) {
        console.log(req.url);
        var queryString = url.parse(req.url, true);
        var urlparms = queryString.query;
        // console.log(urlparms);
        var searchStr = { isdeleted: 0 };
        var recordsTotal = 0;
        var recordsFiltered = 0;
        PurchaseReturn.count({ isdeleted: 0 }, function (err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            PurchaseReturn.count(searchStr, function (err, c) {
                recordsFiltered = c;
                console.log('record fliter count ' + c);
                console.log('start ' + urlparms.start);
                console.log('length ' + urlparms.length);
                PurchaseReturn.aggregate(
                    [{
                        $match: { "isdeleted": 0 }
                    },
                    {
                        $lookup: {
                            from: "mastersuppliers",
                            "localField": "supplierid",
                            "foreignField": "_id",
                            as: "Supplier"
                        }

                    },
                    {
                        $unwind: "$Supplier"
                    },
                    {
                        $project: {
                            "_id": 1,
                            "Supplier.name": 1,
                            "purchasedate": { $dateToString: { format: "%Y-%m-%d", date: "$purchasedate" } },
                            "purchasereturnno": 1,

                            "returndate": { $dateToString: { format: "%Y-%m-%d", date: "$createddate" } },
                            // "total": 1,
                            // "dueamount": "$total"
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
        console.log(req.params._id);
        var id = req.params._id;
        PurchaseReturn.aggregate(
            [{
                $match: { _id: new mongoose.Types.ObjectId(req.params._id), isdeleted: 0 }
            },
            {
                $lookup: {
                    from: "mastersuppliers",
                    "localField": "supplierid",
                    "foreignField": "_id",
                    as: "Supplier"
                }
            },
            {
                $unwind: "$Supplier",
            },
            {
                $lookup: {
                    from: "masterproducts",
                    "localField": "purchaseRetrunDetail.productid",
                    "foreignField": "_id",
                    as: "productdetail"
                }
            },
            {
                $lookup: {
                    from: "purchases",
                    "localField": "purchase_id",
                    "foreignField": "_id",
                    as: "purchases"
                }
            },
            {
                $project: {
                    _id: 1,
                    "purchasedate": { $dateToString: { format: "%d-%m-%Y", date: "$purchasedate" } },
                    "reference": 1,
                    "supplierid": 1,
                    "purchase_id": 1,
                    "Supplier.name": 1,
                    "Supplier.gstin": 1,
                    "Supplier.billingstate": 1,
                    "purchasereturnno": 1,
                    "total": 1,
                    "creditdays": 1,
                    "dueamount": "$total",
                    "reference": 1,
                    "purchaseRetrunDetail": 1,
                    "productdetail.productname": 1,
                    "productdetail._id": 1,
                    "unitcolumn": 1,
                    "hsncolumn": 1,
                    "discountcolumn": 1,
                    "roundoff": 1,
                    "discountype": 1,
                    "taxtype": 1,
                    "purchases.purchaseorderno": 1
                }
            }
            ])
            .then((data) => {

                return res.status(200).send(data)
            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    purchaseretrunno(req, res) {
        PurchaseReturn.aggregate([
            { $match: { isdeleted: 0 } },
            { $count: "myCount" }
        ])
            .then((data) => {
                res.status(200).send({ billno: data.length == 0 ? 1 : data[0].myCount + 1 })
            })
            .catch((error) => res.status(400).send(error))
    },
    delete(req, res) {
        console.log(req.params._id)
        PurchaseReturn.findById(req.params._id)
            .then(data => {
                if (!data) {
                    return res.status(404).send({
                        message: 'Data Not Found',
                    });
                }
                Promise.resolve(data.purchaseRetrunDetail).then(each((ele) =>
                    Product.findById(ele.productid)
                        .then((productdata) => {
                            if (!productdata) {
                                return res.status(404).send({
                                    message: 'Data Not Found',
                                });
                            }
                            productdata.updateOne({
                                stockinhand: parseInt(productdata.stockinhand) + parseInt(ele.qty)
                            }).then((data1) => { })
                        })
                ))

                data.updateOne({
                    isdeleted: 1
                })
                    .then((data5) => res.status(200).send({ status: 'success', message: 'record delete successfully' }))
                    .catch((err) => res.status(400).send({ status: 'Failed', message: err }))

            })
            .catch((error) => res.status(400).send(error));

    },
    purchasenodropdownlist(req, res) {
        purchaseRetrunDetail.aggregate([{
            $match: { "isdeleted": 0 }
        },
        {
            $project: {
                _id: 0,
                id: '$_id',
                name: "$purchaseorderno"
            }
        }
        ])
            .then((data) => { res.status(200).send(data); })
            .catch((error) => res.status(400).send(error));
    },
    purchasedetails(req, res) {
        let count = 0;
        PurchaseReturn.countDocuments({ isdeleted: 0, purchase_id: new mongoose.Types.ObjectId(req.params._id) })
            .then((data) => {
                if (data == 0) {

                    Purchase.aggregate([{
                        $match: { _id: new mongoose.Types.ObjectId(req.params._id), isdeleted: 0 }
                    },
                    {
                        $lookup: {
                            from: "mastersuppliers",
                            "localField": "supplierid",
                            "foreignField": "_id",
                            as: "Supplier"
                        }
                    },
                    {
                        $unwind: "$Supplier",
                    },
                    {
                        $lookup: {
                            from: "masterproducts",
                            "localField": "purchaseDetail.productid",
                            "foreignField": "_id",
                            as: "productdetail"
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            "purchasedate": { $dateToString: { format: "%d-%m-%Y", date: "$purchasedate" } },
                            "reference": 1,
                            "supplierid": 1,
                            "Supplier.name": 1,
                            "Supplier.gstin": 1,
                            "Supplier.billingstate": 1,
                            "purchaseorderno": 1,
                            "total": 1,
                            "creditdays": 1,
                            "dueamount": "$total",
                            "reference": 1,
                            "purchaseDetail": 1,
                            "productdetail.productname": 1,
                            "productdetail._id": 1,
                            "unitcolumn": 1,
                            "hsncolumn": 1,
                            "discountcolumn": 1,
                            "roundoff": 1,
                            "discountype": 1,
                            "taxtype": 1
                        }
                    }
                    ])
                        .then((data) => {
                            return res.status(200).send(data)
                        })
                        .catch((error) => {
                            return res.status(400).send(error)
                        })

                } else {
                    return res.status(400).send({
                        Message: 'Purchase No Already Used',
                    });
                }
            })

    },
}