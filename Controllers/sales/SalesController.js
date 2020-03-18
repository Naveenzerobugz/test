var sales = mongoose.model('sales');
var Product = mongoose.model('MasterProduct');
var company = mongoose.model('MasterCompany');
var Branch = mongoose.model('Branch');
require('../../config/logger');


module.exports = {
    salesnodropdownlist(req, res) {
        sales.aggregate([{
                    $match: {
                        isdeleted: 0,
                        // companyid: new mongoose.Types.ObjectId(req.session.companyid),
                        // branchid: new mongoose.Types.ObjectId(req.session.branchid)
                    }
                },


                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        name: "$invoiceno",
                    }
                }
            ])
            .then((data) => { res.status(200).send(data); })
            .catch((error) => res.status(400).send(error));
    },
    invoiceno(req, res) {
        sales.count({
                isdeleted: 0,
                // companyid: new mongoose.Types.ObjectId(req.session.companyid),
                // branchid: new mongoose.Types.ObjectId(req.session.branchid)
            })
            .then((data) => { res.status(200).send({ billno: 'INV' + (data == null ? 0 : data + 1) }) })
            .catch((error) => res.status(400).send(error))
    },
    insert(req, res) {
        if (req.body._id) {
            sales.findById(req.body._id)
                .then(data => {
                    if (!data) {
                        return res.status(404).send({
                            message: 'Data Not Found',
                        });
                    }
                    return data.updateOne({
                            invoiceno: req.body.invoiceno,
                            invoicedate: req.body.invoicedate,
                            duedate: req.body.duedate,
                            creditdays: req.body.creditdays,
                            reference: req.body.reference,
                            customerid: req.body.customerid,
                            subtotal: req.body.subtotal,
                            roundoff: req.body.roundoff,
                            total: req.body.total,
                            invoiceDetail: req.body.invoiceDetail,
                            gstdetail:req.body.gstdetail,
                            CustomerDetail: req.body.CustomerDetail,
                            hsncolumn: req.body.hsncolumn,
                            unitcolumn: req.body.unitcolumn,
                            discountcolumn: req.body.discountcolumn,
                            discountype: req.body.discountype,
                            taxtype: req.body.taxtype,
                            salesrep: req.body.salesrep,
                            companyid: req.session.companyid,
                            branchid: req.session.branchid,
                            modifiedby: req.session.userid
                        })
                        .then((data) => {
                            req.body.invoiceDetail.forEach((ele) => {
                                Product.findById(ele.productid)
                                    .then((data) => {
                                        if (!data) {
                                            return res.status(404).send({
                                                message: 'Data Not Found',
                                            });
                                        }
                                        data.updateOne({
                                            stockinhand: parseInt(data.stockinhand) + parseInt(ele.saleqty) - parseInt(ele.qty)
                                        }).then((data1) => {})
                                    })
                            })
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
            console.log(req.body)

            sales.create({
                    invoiceno: req.body.invoiceno,
                    invoicedate: req.body.invoicedate,
                    duedate: req.body.duedate,
                    creditdays: req.body.creditdays,
                    reference: req.body.reference,
                    customerid: req.body.customerid,
                    subtotal: req.body.subtotal,
                    roundoff: req.body.roundoff,
                    total: req.body.total,
                    invoiceDetail: req.body.invoiceDetail,
                    gstdetail:req.body.gstdetail,
                    CustomerDetail: req.body.CustomerDetail,
                    hsncolumn: req.body.hsncolumn,
                    unitcolumn: req.body.unitcolumn,
                    discountcolumn: req.body.discountcolumn,
                    discountype: req.body.discountype,
                    taxtype: req.body.taxtype,
                    salesrep: req.body.salesrep,
                    companyid: req.session.companyid,
                    branchid: req.session.branchid,
                    createdby: req.session.usrid,
                    createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                    isdeleted: '0'
                }).then((data) => {
                    req.body.invoiceDetail.forEach((ele) => {
                        Product.findById(ele.productid)
                            .then((data) => {
                                if (!data) {
                                    return res.status(404).send({
                                        message: 'Data Not Found',
                                    });
                                }
                                data.updateOne({
                                    stockinhand: parseInt(data.stockinhand) - parseInt(ele.qty)
                                }).then((data1) => {})
                            })
                    })
                    logger.log('info', 'logjson{ page : purchaes, Acion : Insert,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                    return res.status(200).send({
                        status: 'success',
                        message: 'record added successfully',
                        data,
                    })


                })
                .catch((error) => {
                    res.status(400).send({
                        status: 'Error',
                        message: error
                    })
                })
        }

    },
    list(req, res) {
        console.log(req.url);
        var queryString = url.parse(req.url, true);
        var urlparms = queryString.query;
        // console.log(urlparms);
        var searchStr = {
            isdeleted: 0,
            companyid: new mongoose.Types.ObjectId(req.session.companyid),
            branchid: new mongoose.Types.ObjectId(req.session.branchid)
        };
        var recordsTotal = 0;
        var recordsFiltered = 0;
        sales.count({ isdeleted: 0 }, function(err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            sales.count(searchStr, function(err, c) {
                recordsFiltered = c;
                console.log('record fliter count ' + c);
                console.log('start ' + urlparms.start);
                console.log('length ' + urlparms.length);
                sales.aggregate(
                    [{
                            $match: {
                                isdeleted: 0,
                                //companyid: new mongoose.Types.ObjectId(req.session.companyid),
                                // branchid: new mongoose.Types.ObjectId(req.session.branchid)
                            }
                        },
                        {
                            $lookup: {
                                from: "salereturns",
                                "let": { "id": "$_id" },
                                "pipeline": [{
                                    "$match": {
                                        isdeleted: 0,
                                        "$expr": {
                                            $and: [
                                                { $eq: ["$sale_id", "$$id"] },
                                            ]
                                        },
                                    }
                                }],
                                as: "salereturn",
                            }
                        },
                        {
                            $lookup: {

                                from: "payments",
                                "let": { "sale_id": "$_id" },
                                "pipeline": [{
                                    "$match": {
                                        isdeleted: 0,
                                        type: "customer",
                                        "$expr": {
                                            $and: [
                                                { $eq: ["$trans_id", "$$sale_id"] },
                                            ]
                                        },
                                    }
                                }],
                                as: "receiptpayment",
                            }
                        },
                        {
                            $lookup: {
                                from: "mastercustomers",
                                "localField": "customerid",
                                "foreignField": "_id",
                                as: "customer"
                            }

                        },

                        { $unwind: "$customer" },

                        {
                            $project: {
                                "_id": 1,
                                "invoicedate": { $dateToString: { format: "%Y-%m-%d", date: "$invoicedate" } },
                                "reference": 1,
                                "duedate": { $dateToString: { format: "%Y-%m-%d", date: "$duedate" } },
                                "customer.name": 1,
                                "invoiceno": 1,
                                "total": 1,
                                "dueamount": "$total",
                                "status": {
                                    $cond: [{ $lt: ["$duedate", (new Date())] }, 'OverDue', 'Due'],
                                },
                                'balancedueamount': { $subtract: ['$total', { $add: [{ "$sum": '$salereturn.total' }, { "$sum": '$receiptpayment.payedamount' }] }] }
                            },

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
    testlist(req, res) {
        console.log('test')
        sales.aggregate(
            [
                {
                    $match: { _id: new mongoose.Types.ObjectId(req.params._id), isdeleted: 0 }
                },
                {
                    $unwind: "$invoiceDetail"
                },
                {
                    "$lookup": {
                        "from": "masterproducts",
                        "localField": "invoiceDetail.productid",
                        "foreignField": "_id",
                        "as": "MP"
                    }
                }, 
                 {
                 $group:
                  {
                    _id: { _id:"$_id",customerid:"$customerid",invoiceno:"$invoiceno",hsncolumn:"$hsncolumn",unitcolumn:"$unitcolumn",discountcolumn:"$discountcolumn"},
                    itemsSold: { $push:  { qty: "$invoiceDetail.qty", productid: "$invoiceDetail.productid",name:"$MP.productname",rate:"$invoiceDetail.rate" } }
                  }
                 },
                {
                    $project: {
                        _id: 0,
                        customerid:"$_id.customerid",
                        invoiceno:"$_id.invoiceno",
                        invoiceDetail:"$itemsSold",
                       
                    }
                }
            ]).then(data => { res.send(data) })

    },
    edit(req, res) {
        console.log(req.params._id);
        var id = req.params._id;
        sales.aggregate(
                [

                    {
                        $match: { _id: new mongoose.Types.ObjectId(req.params._id), isdeleted: 0 }
                    },
                    {
                        $lookup: {
                            from: "mastercustomers",
                            "localField": "customerid",
                            "foreignField": "_id",
                            as: "customer"
                        }
                    },
                    {
                        $unwind: "$customer",
                    },
                    {
                        $lookup: {
                            from: "salereturns",
                            "let": { "id": "$_id" },
                            "pipeline": [{
                                "$match": {
                                    isdeleted: 0,
                                    "$expr": {
                                        $and: [
                                            { $eq: ["$sale_id", "$$id"] },
                                        ]
                                    },
                                }
                            }],
                            as: "salereturn",
                        }
                    },
                    {
                        $lookup: {

                            from: "payments",
                            "let": { "sale_id": "$_id" },
                            "pipeline": [{
                                "$match": {
                                    isdeleted: 0,
                                    type: "customer",
                                    "$expr": {
                                        $and: [
                                            { $eq: ["$trans_id", "$$sale_id"] },
                                        ]
                                    },
                                }
                            }],
                            as: "receiptpayment",
                        }
                    },
                    {
                        $lookup: {
                            from: "masterproducts",
                            "localField": "invoiceDetail.productid",
                            "foreignField": "_id",
                            as: "productdetail"
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            "invoicedate": { $dateToString: { format: "%d-%m-%Y", date: "$invoicedate" } },
                            "reference": 1,
                            "customerid": 1,
                            "customer.name": 1,
                            "customer.gstin": 1,
                            "customer.billingstate": 1,
                            "invoiceno": 1,
                            "total": 1,
                            "creditdays": 1,
                            "dueamount": "$total",
                            "reference": 1,
                            "invoiceDetail": 1,
                            // "availbleqty" : { '$add' : [ '$productdetail.openingstock', '$productdetail.stockinhand' ] },
                            "productdetail.productname": 1,
                            "productdetail.openingstock": 1,
                            "productdetail.stockinhand": 1,
                            "productdetail._id": 1,
                            "unitcolumn": 1,
                            "hsncolumn": 1,
                            "discountcolumn": 1,
                            "roundoff": 1,
                            "discountype": 1,
                            "taxtype": 1,
                            "salesrep": 1,
                            'balancedueamount': { $subtract: ['$total', { $add: [{ "$sum": '$salereturn.total' }, { "$sum": '$receiptpayment.payedamount' }] }] }
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

    delete(req, res) {
        sales.findById(req.params._id)
            .then(data => {
                if (!data) {
                    return res.status(404).send({
                        message: 'Data Not Found',
                    });
                }
                data.invoiceDetail.forEach((ele) => {
                    Product.findById(ele.productid)
                        .then((data) => {
                            if (!data) {
                                return res.status(404).send({
                                    message: 'Data Not Found',
                                });
                            }
                            data.updateOne({
                                    stockinhand: parseInt(data.stockinhand) + parseInt(ele.qty)
                                }).then((data1) => { console.log(data1) })
                                .catch((error) => res.status(400).send(error));
                        })
                })
                return data.updateOne({
                        isdeleted: 1
                    })
                    .then((data1) => res.status(200).send({ status: 'success', message: 'Record deleted SuccessFully', data1 }))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },
    invoicebill(req, res) {
        console.log('-----coming to invoice bill-------' + req.params._id)
        sales.aggregate(
                [

                    {
                        $match: { _id: new mongoose.Types.ObjectId(req.params._id), isdeleted: 0 }
                    },

                    {
                        $lookup: {
                            from: "mastercustomers",
                            "localField": "customerid",
                            "foreignField": "_id",
                            as: "customer"
                        }
                    },
                    {
                        $unwind: "$customer",
                        $unwind: "$invoiceDetail",
                    },
                    {
                        $lookup: {
                            from: "masterproducts",
                            "localField": "invoiceDetail.productid",
                            "foreignField": "_id",
                            as: "invoiceDetail.productdetail"
                        }
                    },

                    {
                        $project: {
                            _id: 1,
                            "invoicedate": { $dateToString: { format: "%d-%m-%Y", date: "$invoicedate" } },
                            "reference": 1,
                            "customerid": 1,
                            "customer": 1,
                            "invoiceno": 1,
                            "total": 1,
                            "creditdays": 1,
                            "dueamount": "$total",
                            "reference": 1,
                            "invoiceDetail.productdetail": 1,
                            "invoiceDetail.qty": 1,
                            "invoiceDetail.rate": 1,
                            "invoiceDetail.discount": 1,
                            "invoiceDetail.amount": 1,
                            "unitcolumn": 1,
                            "hsncolumn": 1,
                            "discountcolumn": 1,
                            "roundoff": 1,
                            "discountype": 1,
                            "taxtype": 1,
                            "salesrep": 1,
                            "companyid": 1,
                            "branchid": 1,
                        }
                    }
                ])
            .then((data) => {
                company.findOne({ _id: new mongoose.Types.ObjectId(data[0].companyid) })
                    .then(company => {
                        Branch.findOne({
                                companyid: new mongoose.Types.ObjectId(data[0].companyid),
                                _id: new mongoose.Types.ObjectId(data[0].branchid)
                            })
                            .then(Branch => {
                                return res.status(200).send({ invoice: data, company, Branch })
                            })
                            .catch(err => res.status(400).send(err))
                    })
                    .catch(err => res.status(400).send(err))

            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    }
}