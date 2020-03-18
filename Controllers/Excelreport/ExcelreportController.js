var Purchase = mongoose.model('Purchase');
var sales = mongoose.model('sales');
var Product = mongoose.model('MasterProduct');
var customer = mongoose.model('mastercustomer');
var supplier = mongoose.model('mastersupplier');
var recipt = mongoose.model('ReceiptPayment');
var supplier = mongoose.model('mastersupplier');
var url = require('url');
module.exports = {
    pushaselist(req, res) {
        var searchStr = {};
        if (req.body.type == 'Download') {
            searchStr = {
                $match: {
                    isdeleted: 0,
                }
            };
        } else {
            searchStr = {
                $match: {
                    isdeleted: 0,
                    purchasedate: {
                        $gte: new Date(req.body.fdate),
                        $lt: new Date(req.body.tdate)
                    }
                }
            };
        }
        Purchase.aggregate([{
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
                    "_id": 0,
                    "total": 1,
                    "Supplier.name": 1,
                    "purchaseorderno": 1,
                    "dueamount": "$total",
                    "purchasedate": { $dateToString: { format: "%Y-%m-%d", date: "$purchasedate" } },
                }
            }

        ]).then(data => {
            res.status(200).send({ data: data });
        })
    },
    saleslist(req, res) {
        console.log(req.body)
        var searchStr = {};
        if (req.body.type == 'Download') {
            searchStr = {
                $match: {
                    isdeleted: 0,
                }

            };
        } else {
            if (req.body.status == 'Overdue') {
                searchStr = {
                    $match: {
                        isdeleted: 0,
                        duedate: { $lt: (new Date()) },
                        invoicedate: {
                            $gte: new Date(req.body.fdate),
                            $lt: new Date(req.body.tdate)
                        }
                    }

                };
            } else if (req.body.status == 'Ondue') {
                searchStr = {
                    $match: {
                        isdeleted: 0,
                        duedate: { $gt: (new Date()) },
                        invoicedate: {
                            $gte: new Date(req.body.fdate),
                            $lt: new Date(req.body.tdate)
                        }
                    }
                };
            } else {
                searchStr = {
                    $match: {
                        isdeleted: 0,
                        invoicedate: {
                            $gte: new Date(req.body.fdate),
                            $lt: new Date(req.body.tdate)
                        }
                    }
                };
            }
        }
        sales.aggregate([
            searchStr,
            {
                $lookup: {
                    from: "mastercustomers",
                    "localField": "customerid",
                    "foreignField": "_id",
                    as: "customer"
                }

            },
            {
                $unwind: "$customer"
            },
            {
                $project: {
                    "_id": 0,
                    "invoicedate": { $dateToString: { format: "%Y-%m-%d", date: "$invoicedate" } },
                    "reference": 1,
                    "duedate": { $dateToString: { format: "%Y-%m-%d", date: "$duedate" } },
                    "customer.name": 1,
                    "invoiceno": 1,
                    "total": 1,
                    "dueamount": "$total",
                    "status": {
                        $cond: [{ $lt: ["$duedate", (new Date())] }, 'OverDue', 'Due'],
                    }
                },

            },
        ]).then(data => {

            res.status(200).send({ data: data });
        })
    },
    stocklist(req, res) {
        Product.aggregate([{
                    $match: { "isdeleted": 0 }
                },
                {
                    $lookup: {
                        from: "masterattributes",
                        "localField": "categoryid",
                        "foreignField": "categoryid",
                        as: "attributes"
                    }
                },
                {
                    $lookup: {
                        from: "mastertaxes",
                        "localField": "taxid",
                        "foreignField": "_id",
                        as: "tax"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        //id:0,
                        name: "$productname",
                        // hsnorsac_code:1,
                        purchaseprice: 1,
                        salesprice: 1,
                        "availbleqty": { '$add': ['$openingstock', '$stockinhand'] },
                        // "attributes.type":1,
                        // "attributes.attributename":1,
                        // "tax.taxname":1,
                        // "tax.sgst":1,
                        // "tax.cgst":1,
                        // "tax.igst":1
                    }
                }
            ])
            .then(data => {
                res.status(200).send({ data: data });

            })
    },
    customeroutstanding(req, res) {
        console.log(req.body.customer)
        var regex = new RegExp(req.body.customer, "i")
        customer.aggregate([{
                    $match: {
                        $or: [
                            { 'name': regex },
                        ],
                        isdeleted: 0,
                    }
                },
                {
                    $lookup: {
                        from: "sales",
                        "let": { "id": "$_id" },
                        "pipeline": [{
                            "$match": {
                                isdeleted: 0,
                                "$expr": {
                                    $and: [
                                        { $eq: ["$customerid", "$$id"] },
                                    ]
                                },
                            }
                        }],
                        as: "invoice",
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
                                        { $eq: ["$customerid", "$$id"] },
                                    ]
                                },
                            }
                        }],
                        as: "saleretrun",
                    }
                },
                {
                    $lookup: {
                        from: "payments",
                        "let": { "id": "$_id" },
                        "pipeline": [{
                            "$match": {
                                isdeleted: 0,
                                "$expr": {
                                    $and: [
                                        { $eq: ["$typeid", "$$id"] },
                                    ]
                                },
                            }
                        }],
                        as: "recipt",
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: 1,
                        mobile: 1,
                        // totalinvoiceamount: {
                        //     $sum: "$invoice.total",

                        // },
                        // totalreciptamount: {
                        //     $sum: "$recipt.payedamount",

                        // },
                        pendingamount: {
                            $subtract: [{
                                $subtract: [
                                    { $sum: "$invoice.total" }, { $sum: "$saleretrun.total" }
                                ]
                            }, {
                                $sum: "$recipt.payedamount"
                            }]
                        }
                    }
                }
            ])
            .then(data => {
                res.status(200).send({ data: data });
            })
    },
    supplieroutstanding(req, res) {
        var regex = new RegExp(req.body.supplier, "i")
        supplier.aggregate([{
                    $match: {
                        $or: [
                            { 'name': regex },
                        ],
                        isdeleted: 0,
                    }
                },
                {
                    $lookup: {
                        from: "purchases",
                        "let": { "id": "$_id" },
                        "pipeline": [{
                            "$match": {
                                isdeleted: 0,
                                "$expr": {
                                    $and: [
                                        { $eq: ["$supplierid", "$$id"] },
                                    ]
                                },
                            }
                        }],
                        as: "purchase",
                    }
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
                                        { $eq: ["$supplierid", "$$id"] },
                                    ]
                                },
                            }
                        }],
                        as: "purchasereturn",
                    }
                },
                {
                    $lookup: {
                        from: "payments",
                        "let": { "id": "$_id" },
                        "pipeline": [{
                            "$match": {
                                isdeleted: 0,
                                "$expr": {
                                    $and: [
                                        { $eq: ["$typeid", "$$id"] },
                                    ]
                                },
                            }
                        }],
                        as: "recipt",
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: 1,
                        mobile: 1,
                        // totalinvoiceamount: {
                        //     $sum: "$purchase.total",

                        // },
                        // totalreciptamount: {
                        //     $sum: "$recipt.payedamount",

                        // },
                        pendingamount: {
                            $subtract: [{
                                $subtract: [
                                    { $sum: "$purchase.total" }, { $sum: "$purchasereturn.total" }
                                ]
                            }, {
                                $sum: "$recipt.payedamount"
                            }]
                        }
                    }
                }
            ])
            .then(data => {
                res.status(200).send({ data: data });
            })
    }

}