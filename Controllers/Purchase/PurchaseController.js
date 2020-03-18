var Purchase = mongoose.model('Purchase');
var Product = mongoose.model('MasterProduct');
var each = require('promise-each');
require("datejs");
require('../../config/logger');
module.exports = {
    async insert(req, res) {
        if (req.body._id) {
            console.log(req.body.gstdetail)
            Purchase.findById(req.body._id)
                .then(data => {
                    if (!data) {
                        return res.status(400).send('Data Not Found')


                    }
                    Promise.resolve(data.purchaseDetail).then(each((ele) =>
                        req.body.purchaseDetail.forEach((update) => {
                            if (ele.productid == update.productid) {
                                Product.findById(ele.productid)
                                    .then((data) => {
                                        if (!data) {
                                            return res.status(404).send({
                                                message: 'Data Not Found',
                                            });
                                        }
                                        data.updateOne({
                                            stockinhand: (parseInt(data.stockinhand) - parseInt(ele.qty)) + parseInt(update.qty)
                                        }).then((data1) => { })
                                    })
                            }
                        })
                    ))

                    return data.updateOne({
                        purchaseorderno: req.body.purchaseorderno,
                        purchasedate: req.body.purchasedate,
                        creditdays: req.body.creditdays,
                        reference: req.body.reference,
                        supplierid: req.body.supplierid,
                        subtotal: req.body.subtotal,
                        roundoff: req.body.roundoff,
                        roundofftype: req.body.roundofftype,
                        actualtotal: req.body.actualtotal,
                        total: req.body.total,
                        purchaseDetail: req.body.purchaseDetail,
                        SupplierDetail: req.body.SupplierDetail,
                        hsncolumn: req.body.hsncolumn,
                        unitcolumn: req.body.unitcolumn,
                        discountcolumn: req.body.discountcolumn,
                        discountype: req.body.discountype,
                        taxtype: req.body.taxtype,
                        companyid: req.session.companyid,
                        branchid: req.session.branchid,
                        modifiedby: req.session.userid,
                        gstdetail: req.body.gstdetail
                    })
                        .then((data) => {

                            logger.log('info', 'logjson{ page : purchaes, Acion : Update,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                            res.status(200).send({
                                status: 'success',
                                message: 'record Updated  successfully',

                            })
                        })
                })
                .catch(err => res.status(400).send(err))
        } else {
            console.log('---Insert process----')

            await Purchase.create({
                purchaseorderno: req.body.purchaseorderno,
                purchasedate: req.body.purchasedate,
                creditdays: req.body.creditdays,
                reference: req.body.reference,
                supplierid: req.body.supplierid,
                subtotal: req.body.subtotal,
                roundoff: req.body.roundoff,
                roundofftype: req.body.roundofftype,
                actualtotal: req.body.actualtotal,
                total: req.body.total,
                purchaseDetail: req.body.purchaseDetail,
                SupplierDetail: req.body.SupplierDetail,
                hsncolumn: req.body.hsncolumn,
                unitcolumn: req.body.unitcolumn,
                discountcolumn: req.body.discountcolumn,
                discountype: req.body.discountype,
                taxtype: req.body.taxtype,
                gstdetail: req.body.gstdetail,
                companyid: req.session.companyid,
                branchid: req.session.branchid,
                createdby: req.session.usrid,
                createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                isdeleted: '0'
            }).then((data) => {

                Promise.resolve(req.body.purchaseDetail).then(each((ele) =>
                    Product.findById(ele.productid)
                        .then((data2) => {
                            if (!data2) {
                                return res.status(400).send('Data Not Found');
                            }
                            console.log('this is stockinhand :' + data2.stockinhand)
                            data2.updateOne({
                                stockinhand: parseInt(data2.stockinhand) + parseInt(ele.qty)
                            }).then((data1) => { })
                        })

                ))


                logger.log('info', 'logjson{ page : purchaes, Acion : Insert,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                res.status(200).send({
                    status: 'success',
                    message: 'record added successfully',

                })
            })
                .catch((error) => {
                    res.status(400).send(error



                    )
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
        Purchase.count({ isdeleted: 0 }, function (err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            Purchase.count(searchStr, function (err, c) {
                recordsFiltered = c;
                console.log('record fliter count ' + c);
                console.log('start ' + urlparms.start);
                console.log('length ' + urlparms.length);
                Purchase.aggregate(
                    [{
                        $match: { "isdeleted": 0 }
                    },
                    {
                        $lookup: {
                            from: "purchasereturns",
                            "let": { "id": "$_id" },
                            "pipeline": [{
                                "$match": {
                                    isdeleted: 0,
                                    "$expr": {
                                        $and: [
                                            { $eq: ["$purchase_id", "$$id"] },
                                        ]
                                    },
                                }
                            }],
                            as: "purchasereturns",
                        }
                    },
                    {
                        $lookup: {

                            from: "payments",
                            "let": { "purchase_id": "$_id" },
                            "pipeline": [{
                                "$match": {
                                    isdeleted: 0,
                                    type: "supplier",
                                    "$expr": {
                                        $and: [
                                            { $eq: ["$trans_id", "$$purchase_id"] },
                                        ]
                                    },
                                }
                            }],
                            as: "balancepayment",
                        }
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
                            "purchasedate": { $dateToString: { format: "%d-%m-%Y", date: "$purchasedate" } },
                            "reference": 1,
                            "Supplier.name": 1,
                            "purchaseorderno": 1,
                            "total": 1,
                            // "dueamount": "$total",
                            creditdays: 1,
                            'dueamount': { $subtract: ['$total', { $add: [{ "$sum": '$purchasereturns.total' }, { "$sum": '$balancepayment.payedamount' }] }] }
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
        Purchase.aggregate(
            [

                {
                    $match: { _id: new mongoose.Types.ObjectId(req.params._id), isdeleted: 0 }
                },
                {
                    $lookup: {
                        from: "purchasereturns",
                        "let": { "id": "$_id" },
                        "pipeline": [{
                            "$match": {
                                isdeleted: 0,
                                "$expr": {
                                    $and: [
                                        { $eq: ["$purchase_id", "$$id"] },
                                    ]
                                },
                            }
                        }],
                        as: "purchasereturns",
                    }
                },
                {
                    $lookup: {

                        from: "payments",
                        "let": { "purchase_id": "$_id" },
                        "pipeline": [{
                            "$match": {
                                isdeleted: 0,
                                type: "supplier",
                                "$expr": {
                                    $and: [
                                        { $eq: ["$trans_id", "$$purchase_id"] },
                                    ]
                                },
                            }
                        }],
                        as: "balancepayment",
                    }
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
                        "reference": 1,
                        "purchaseDetail": 1,
                        "productdetail.productname": 1,
                        "productdetail._id": 1,
                        "unitcolumn": 1,
                        "hsncolumn": 1,
                        "discountcolumn": 1,
                        "roundoff": 1,
                        "discountype": 1,
                        "taxtype": 1,
                        roundofftype: 1,
                        roundoff: 1,
                        actualtotal: 1,
                        'dueamount': { $subtract: ['$total', { $add: [{ "$sum": '$purchasereturns.total' }, { "$sum": '$balancepayment.payedamount' }] }] }
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
    purchaseno(req, res) {

        Purchase.aggregate([
            { $match: { isdeleted: 0 } },
            { $count: "myCount" }
        ])
            .then((data) => {

                res.status(200).send({ billno: data.length == 0 ? 1 : data[0].myCount + 1 })
            })
            .catch((error) => res.status(400).send(error))
    },
    delete(req, res) {
        Purchase.findById(req.params._id)
            .then(data => {
                if (!data) {
                    return res.status(404).send({
                        message: 'Data Not Found',
                    });
                }
                Promise.resolve(data.purchaseDetail).then(each((ele) =>
                    Product.findById(ele.productid)
                        .then((data5) => {
                            if (!data5) {
                                return res.status(404).send({
                                    message: 'Data Not Found',
                                });
                            }
                            data5.updateOne({
                                stockinhand: parseInt(data5.stockinhand) - parseInt(ele.qty)
                            }).then((data1) => { })
                        })
                ))

                return data.updateOne({
                    isdeleted: 1
                })
                    .then((data1) => res.status(200).send({ status: 'success', message: 'Record deleted SuccessFully', data1 }))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },
    purchasenodropdownlist(req, res) {
        Purchase.aggregate([{
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
    balance_purchasedetail(req, res) {
        Purchase.aggregate([{
            $match: { isdeleted: 0, supplierid: new mongoose.Types.ObjectId(req.params.id) }
        },
        {
            $lookup: {
                from: "purchasereturns",
                "let": { "id": "$_id" },
                "pipeline": [{
                    "$match": {
                        isdeleted: 0,
                        "$expr": {
                            $and: [
                                { $eq: ["$purchase_id", "$$id"] },
                            ]
                        },
                    }
                }],
                as: "purchasereturns",
            }
        },
        {
            $lookup: {

                from: "payments",
                "let": { "purchase_id": "$_id" },
                "pipeline": [{
                    "$match": {
                        isdeleted: 0,
                        type: "supplier",
                        "$expr": {
                            $and: [
                                { $eq: ["$trans_id", "$$purchase_id"] },
                            ]
                        },
                    }
                }],
                as: "balancepayment",
            }
        },

        {
            $project: {
                _id: 1,
                'purchasereturns._id': 1,
                'purchasereturns.purchase_id': 1,
                'purchasereturns.total': 1,
                'creditdays': 1,
                'purchaseorderno': 1,
                "purchasedate": { $dateToString: { format: "%d-%m-%Y", date: "$purchasedate" } },
                "balancepayment.balance": 1,
                'total': 1,
                'balance': { $subtract: ['$total', { $add: [{ "$sum": '$purchasereturns.total' }, { "$sum": '$balancepayment.payedamount' }] }] }

            }
        }
        ])
            .then((data) => res.status(200).send(data))
            .catch((err) => res.status(400).send(err))
    },



}