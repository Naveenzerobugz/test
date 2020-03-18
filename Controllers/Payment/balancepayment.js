var Payment = mongoose.model('Payment');
var UserCreation = mongoose.model('UserCreation');
module.exports = {
    insert(req, res) {
        if (req.body._id) {
            Payment.findById(req.body._id)
                .then((data) => {
                    data.updateOne({
                        billno: req.body.billno,
                        billdate: req.body.billdate,
                        type: 'supplier',
                        typeid: req.body.typeid,
                        paidfrom: req.body.paidfrom,
                        referencemode: req.body.referencemode,
                        reference: req.body.reference,
                        paidamount: req.body.paidamount,
                        trans_no: req.body.trans_no,
                        trans_date: req.body.trans_date,
                        trans_id: req.body.trans_id,
                        payedamount: req.body.payedamount,
                        balance: req.body.balance,
                        // Paymentdetail:req.body.Paymentdetail,
                        companyid: req.session.companyid,
                        updatedby: req.session.usrid,
                        updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                        isdeleted: '0'
                    }).then((data) => {
                        logger.log('info', 'logjson{ page : BalancePayment, Acion : update,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                        res.status(200).send({
                            status: 'success',
                            message: 'record update successfully',

                        })
                    }).catch((error) => {
                        res.status(400).send({
                            status: 'Error',
                            message: error
                        })
                    })
                }).catch((error) => {
                    res.status(400).send({
                        status: 'Error',
                        message: error
                    })
                })
        }
        else {

            Payment.create({
                billno: req.body.billno,
                billdate: req.body.billdate,
                type: 'supplier',
                typeid: req.body.typeid,
                paidfrom: req.body.paidfrom,
                referencemode: req.body.referencemode,
                reference: req.body.reference,
                paidamount: req.body.paidamount,
                trans_no: req.body.trans_no,
                trans_date: req.body.trans_date,
                trans_id: req.body.trans_id,
                payedamount: req.body.payedamount,
                balance: req.body.balance,
                // Paymentdetail:req.body.Paymentdetail,
                companyid: req.session.companyid,
                createdby: req.session.usrid,
                createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                isdeleted: '0'
            }).then((data) => {
                logger.log('info', 'logjson{ page : BalancePayment, Acion : Insert,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                res.status(200).send({
                    status: 'success',
                    message: 'record added successfully',
                })
            }).catch((error) => {
                res.status(400).send({
                    status: 'Error',
                    message: error
                })
            }
            )
        }
    },
    list(req, res) {

        var queryString = url.parse(req.url, true);
        var urlparms = queryString.query;
        // console.log(urlparms);
        var searchStr = { isdeleted: 0 };
        var recordsTotal = 0;
        var recordsFiltered = 0;
        Payment.count({ isdeleted: 0 }, function (err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            Payment.count(searchStr, function (err, c) {
                recordsFiltered = c;
                console.log('record fliter count ' + c);
                console.log('start ' + urlparms.start);
                console.log('length ' + urlparms.length);
                Payment.aggregate(
                    [
                        {
                            $match: { type: "supplier" }
                        },
                        {
                            $lookup:
                            {
                                from: "mastersuppliers",
                                "localField": "typeid",
                                "foreignField": "_id",
                                as: "Supplier"
                            }
                        },
                        {
                            $lookup:
                            {
                                from: "masterbanks",
                                "localField": "paidfrom",
                                "foreignField": "_id",
                                as: "bankdetails"
                            }
                        },
                        {
                            "$group": {
                                _id: {
                                    billno: "$billno",
                                    billdate: { $dateToString: { format: "%Y-%m-%d", date: "$billdate" } },
                                    paidamount: "$paidamount",
                                    suppliername: "$Supplier.name",
                                    paymentthrough: "$bankdetails.bankname",
                                    referencemode: "$referencemode",
                                    isdeleted: "$isdeleted"
                                },
                                // totalqty: { "$sum": "$payedamount" },
                                "count": { "$sum": 1 }
                            }

                        },


                        {
                            $project: {
                                //billdate:1,
                                _id: 1,
                                // "_id":0,
                                // billno:"$_id.billno",
                                // billdate:"$_id.billdate",
                                // paidamount:"$_id.paidamount",
                                // suppliername:"$_id.suppliername",
                                // method:"$_id.bankdetails",
                                // referencemode:"$_id.referencemode"

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
    paymentno(req, res) {
        Payment.aggregate([
            {
                $match: { type: "supplier" }
            },
            {
                $lookup:
                {
                    from: "mastersuppliers",
                    "localField": "typeid",
                    "foreignField": "_id",
                    as: "Supplier"
                }
            },
            {
                $lookup:
                {
                    from: "masterbanks",
                    "localField": "paidfrom",
                    "foreignField": "_id",
                    as: "bankdetails"
                }
            },
            {
                "$group": {
                    _id: {
                        billpaymentno: "$billno",
                        billdate: { $dateToString: { format: "%Y-%m-%d", date: "$billdate" } },
                        paidamount: "$paidamount",
                        suppliername: "$Supplier.name",
                        bankdetails: "$bankdetails.bankname",
                        referencemode: "$referencemode"
                    },
                }
            },

            { $count: "myCount" }
        ])
            .then((data) => {
                res.status(200).send({ billno: data.length == 0 ? 1 : data[0].myCount + 1 })
                //  res.status(200).send(data)
            })
            .catch((error) => res.status(400).send(error))
    },
    edit(req, res) {

        Payment.aggregate([
            {
                $match: { billno: req.params.billno, isdeleted: 0, type: "supplier" }
            },
            {
                $lookup:
                {
                    from: "mastersuppliers",
                    "localField": "typeid",
                    "foreignField": "_id",
                    as: "Supplier"
                }
            },
            {
                $project: {
                    _id: 1,
                    "billpaymentdate": { $dateToString: { format: "%d-%m-%Y", date: "$billdate" } },
                    "billpaymentno": "$billno",
                    "paidfrom": 1,
                    referencemode: 1,
                    "paidamount": 1,
                    "reference": 1,
                    "supplierid": "$typeid",
                    "Supplier.name": 1,
                    purchaseno: "$trans_no",
                    purchasedate: { $dateToString: { format: "%d-%m-%Y", date: "$trans_date" } },
                    purchase_id: "$trans_id",
                    payedamount: 1,
                    balance: 1,
                }
            }
        ])
            .then((data) => res.status(200).send(data))
            .catch((err) => res.status(400).send(err))


    },
    delete(req, res) {
        Payment.find({ isdeleted: 0, billno: req.body.billno })
            .then((data) => {


                data.forEach((ele) => {
                    Payment.findById(ele._id)
                        .then((data2) => {
                            data2.updateOne({
                                isdeleted: 1,
                                note: req.body.note,
                                updatedby: req.session.usrid,
                                updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                            }).then((data3) => { })
                        })
                })
                res.status(200).send({
                    status: 'success',
                    message: 'record delete successfully',
                })


            })
            .catch((err) => res.status(400).send(err))
    },
 find_cancelperson(req, res) {
        let date = '', note = '';
        let details = '';
        Payment.aggregate([
            {
                $match: { billno: req.params.billno, type: "supplier" }
            },
            {
                $lookup:
                {
                    from: "mastersuppliers",
                    "localField": "typeid",
                    "foreignField": "_id",
                    as: "Supplier"
                }
            },
            {
                $project: {
                    _id: 1,
                    "billpaymentdate": { $dateToString: { format: "%d-%m-%Y", date: "$billdate" } },
                    "billpaymentno": "$billno",
                    "paidfrom": 1,
                    referencemode: 1,
                    "paidamount": 1,
                    "reference": 1,
                    "supplierid": "$typeid",
                    "Supplier.name": 1,
                    purchaseno: "$trans_no",
                    purchasedate: { $dateToString: { format: "%d-%m-%Y", date: "$trans_date" } },
                    purchase_id: "$trans_id",
                    payedamount: 1,
                    balance: 1,
                    updateddate: { $dateToString: { format: "%d-%m-%Y", date: "$updateddate" } },
                    note: "$note",
                    updatedby:1
                }
            }
          
           
        ]).then((data) => {
                      UserCreation.findById(data[0].updatedby)
                .then((data2) => {
                
                    details = {
                        name: data2.name,
                        date: data[0].updateddate,
                        note:data[0].note
                    }
                    data.push(details)
                    return res.status(200).send(data);
               })
        })
        .catch((err) => res.status(400).send(err))
           

    }

}