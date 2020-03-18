const expense = mongoose.model('expense');
const Payment = mongoose.model('Payment');

module.exports = {
    insertupdate(req, res) {
        console.log(req.body)
        console.log(req.files)
        if (!req.body.id) {
            return expense.create({
                entrydate: req.body.entrydate,
                paymode: req.body.paymode,
                refrensemode: req.body.refrensemode,
                refrensedesc: req.body.refrensedesc,
                description: req.body.description,
                totalamt: req.body.totalamt,
                uploadfile: req.files[0] == undefined ? "" : "/appfiles/expensefiles/" + req.files[0].originalname,
                expansedetail: JSON.parse(req.body.expansedetail),
                companyid: req.session.companyid,
                branchid: req.session.branchid,
                createdby: req.session.usrid,
                createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                isdeleted: '0'
            })
                .then((data) => {
                    Payment.create({
                        trans_date: req.body.entrydate,
                        type: 'Expense',
                        trans_id: data._id,
                        paidfrom: req.body.paymode,
                        referencemode: req.body.refrensemode,
                        reference: req.body.refrensedesc,
                        paidamount: req.body.totalamt,
                        companyid: req.session.companyid,
                        branchid: req.session.branchid,
                        createdby: req.session.usrid,
                        createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                        updatedby: req.session.usrid,
                        updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                        isdeleted: '0'
                    }).then((data) => {
                        logger.log('info', 'logjson{ page : Expense, Acion : Insert,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                        res.status(200).send({ status: 'success', message: 'record added successfully', data })
                    }).catch((error) => {
                        res.status(400).send({
                            status: 'Error',
                            message: error
                        })
                    }
                    )

                })
                .catch((error) => res.status(400).send(error))
        } else {
            return expense.findById(req.body.id)
                .then(exp => {
                    if (!exp) {
                        return res.status(400).send('no data found')
                    }
                    return exp.updateOne({
                        entrydate: req.body.entrydate,
                        paymode: req.body.paymode,
                        refrensemode: req.body.refrensemode,
                        refrensedesc: req.body.refrensedesc,
                        description: req.body.description,
                        totalamt: req.body.totalamt,
                        uploadfile: req.files[0] == undefined ? "" : "/appfiles/expensefiles/" + req.files[0].originalname,
                        expansedetail: JSON.parse(req.body.expansedetail),
                        // updatedby: req.session.usrid,
                        updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                        isdeleted: '0'
                    })
                        .then((data) => {
                            Payment.findOne({ trans_id: new mongoose.Types.ObjectId(exp._id) })
                                .then((pay) => {
                                    pay.updateOne({
                                        billdate: req.body.entrydate,
                                        paidfrom: req.body.paymode,
                                        referencemode: req.body.refrensemode,
                                        reference: req.body.refrensedesc,
                                        paidamount: req.body.totalamt,
                                        updatedby: req.session.usrid,
                                        updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                                    }).then((Payment) => {
                                        logger.log('info', 'logjson{ page : Expense, Acion : update,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                                        res.status(200).send({ status: 'success', message: 'record Update successfully', data })
                                    }).catch((error) => res.status(400).send(error))

                                }).catch((error) => res.status(400).send(error))
                        })
                        .catch((error) => res.status(400).send(error))
                })
                .catch((error) => res.status(400).send(error))
        }
    },
    delete(req, res) {
        return expense.findById(req.params.id)
            .then(exp => {
                return exp.updateOne({
                    isdeleted: '1',
                    updatedby: req.session.usrid,
                    updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                })
                    .then((data) => {
                        Payment.findOne({ trans_id: new mongoose.Types.ObjectId(exp._id) })
                            .then((pay) => {
                                pay.updateOne({
                                    isdeleted: '1',
                                    updatedby: req.session.usrid,
                                    updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                                }).then((Payment) => {
                                    logger.log('info', 'logjson{ page : Expense, Acion : Delete,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
                                    res.status(200).send({ status: 'Success', message: 'record Deleted successfully', data })
                                }).catch((error) => res.status(400).send(error))

                            }).catch((error) => res.status(400).send(error))
                    })
                    .catch((error) => res.status(400).send(error))
            })
            .catch((error) => res.status(400).send(error))
    },
    
    getlist(req, res) {
        expense.aggregate(
            [
                {
                    $match: { _id: new mongoose.Types.ObjectId(req.params.id), isdeleted: 0 }
                },
                {
                    $unwind: "$expansedetail"
                },
                {
                    $lookup:
                    {
                        from: "masterexpanses",
                        "localField": "expansedetail.expanseid",
                        "foreignField": "_id",
                        as: "expanse"
                    }
                }, 
                 {
                 $group:
                  {
                    _id: { _id:"$_id",
                    entrydate:"$entrydate",
                    paymode:"$paymode",
                    refrensemode:"$refrensemode",
                    totalamt:"$totalamt",
                    description:"$description"},
                   
                    expansedetail: { $push: 
                         {  
                            _id: "$expansedetail.expanseid",
                            expensedesc:"$expansedetail.expensedesc",
                             amount:"$expansedetail.amount",
                             expanse: "$expanse",
                             
                              
                            } 
                        }
                  }
                 },
                {
                    $project: {
                        _id:"$_id._id",
                        entrydate:{ $dateToString: { format: "%d-%m-%Y", date: "$_id.entrydate" } },
                        paymode:"$_id.paymode",
                        refrensemode:"$_id.refrensemode",
                        totalamt:"$_id.totalamt",
                        description:"$_id.description",
                        expensedetail:"$expansedetail",
                        
                       
                       
                    }
                }
            ]).then(data => { res.send(data) })

    },
    list(req, res) {
        console.log(req.session.branchid)
        console.log(req.body.fdate)
        console.log(new Date(req.body.fdate))
        var orderby = {};
        if (req.body['order[0][column]'] == '0') {
            if (req.body['order[0][dir]'] == 'asc') {
                orderby = { $sort: { _id: -1 } };
            }
            else {
                orderby = { $sort: { _id: 1 } };
            }
        } else if (req.body['order[0][column]'] == '1') {
            if (req.body['order[0][dir]'] == 'asc') {
                orderby = { $sort: { paymode: -1 } };
            }
            else {
                orderby = { $sort: { paymode: 1 } };
            }
        }
        var searchStr = req.body['search[value]'];
        if (req.body['search[value]']) {
            var regex = new RegExp(req.body['search[value]'], "i")
           
            searchStr = {
                $match: {
                    $or: [
                        { 'entrydate': regex },
                    ],
                    entrydate:{
                        $gte: new Date(req.body.fdate),
                        $lt: new Date(req.body.tdate)
                    },
                    isdeleted: 0,
                    companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    branchid: new mongoose.Types.ObjectId(req.session.branchid)
                }

            };
        }
        else {
            console.log('else is working')
            searchStr = {
                $match: {
                    entrydate: {
                        $gte:new Date(req.body.fdate),//new Date('2020-03-13T00:07:32.000Z'),//  new Date(req.body.fdate),
                        $lt: new Date(req.body.tdate)
                    },
                    isdeleted: 0,
                    companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    branchid: new mongoose.Types.ObjectId(req.session.branchid)
                }
            };
        }
        var recordsTotal = 0;
        var recordsFiltered = 0;
        expense.count({
            isdeleted: 0,
            companyid: new mongoose.Types.ObjectId(req.session.companyid),
            branchid: new mongoose.Types.ObjectId(req.session.branchid)
        })

            .then(c => {
                console.log('records total ' + c)
                recordsTotal = c;
                expense.aggregate(
                    [
                        {
                            "$match": {
                               
                                "isdeleted": 0,
                                companyid: new mongoose.Types.ObjectId(req.session.companyid),
                                branchid: new mongoose.Types.ObjectId(req.session.branchid),
                                entrydate: {
                                    $gte:new Date('2020-03-13T00:00:00.000+00:00'),// new Date(req.body.fdate),
                                    $lt: new Date(req.body.tdate)
                                },
                            }
                        },
                        {
                            "$group": {
                                "_id": {},
                                "COUNT(*)": {
                                    "$sum": 1
                                }
                            }
                        },
                        {
                            "$project": {
                                "COUNT": "$COUNT(*)",
                                "_id": 0
                            }
                        }
                    ]
                )
                    .then(c => {
                         console.log('recordsFiltered')
                         console.log(c)
                        recordsFiltered =(c = [] ? '0' :  c[0].COUNT);
                        expense.aggregate([
                            searchStr,
                            {
                                $lookup:
                                {
                                    from: "masterbanks",
                                    "localField": "paymode",
                                    "foreignField": "_id",
                                    as: "bankdetail"
                                }
                            },
                            {
                                $unwind: "$bankdetail",
                            },
                            {
                                $project: {
                                    "_id": 1,
                                    "entrydate": { $dateToString: { format: "%d-%m-%Y", date: "$entrydate" } },
                                    "paymode": 1,
                                    "bankdetail.bankname": 1,
                                    "refrensemode": 1,
                                    "refrensedesc": 1,
                                    "totalamt": 1,
                                },

                            },
                            { "$skip": Number(req.body.start), },
                            { "$limit": Number(req.body.length) },
                        ]).then(results => {
                            var data = JSON.stringify({
                                "draw": req.body.draw,
                                "recordsFiltered": recordsFiltered,
                                "recordsTotal": recordsTotal,
                                "data": results
                            });
                            // console.log(data)
                            res.send(data);
                        })
                            .catch(err => {
                                console.log('-----------result------------')
                                console.log(err)
                                res.status(400).send(err)
                            })
                    })
                    .catch(err => {
                        console.log('---------------cout2----------')
                        console.log(err)
                        res.status(400).send(err)
                    })
            })
            .catch(err => {
                console.log('----------cout1----------')
                console.log(err)
                res.status(400).send(err)
            })
    }
    ,
    list1(req, res) {
        return expense.aggregate([
            {
                $match: { "isdeleted": 0 }
            },
            {
                $lookup:
                {
                    from: "masterbanks",
                    "localField": "paymode",
                    "foreignField": "_id",
                    as: "bankdetail"
                }
            },
            {
                $unwind: "$bankdetail",
            },
            {
                $project: {
                    "_id": 1,
                    "entrydate": 1,
                    "paymode": 1,
                    "bankdetail.bankname": 1,
                    "refrensemode": 1,
                    "refrensedesc": 1,
                    "totalamt": 1,
                },

            },
        ])
            .then((data) => res.status(200).send(data))
            .catch((error) => res.status(400).send(error))
    },
    list2(req, res) {
        var options = {
            allowDiskUse: true
        };

        //  var pipeline =
        return expense.aggregate(
            [
                {
                    "$match": {
                        "isdeleted": 0
                    }
                },
                {
                    "$group": {
                        "_id": {},
                        "COUNT(*)": {
                            "$sum": 1
                        }
                    }
                },
                {
                    "$project": {
                        "COUNT": "$COUNT(*)",
                        "_id": 0
                    }
                }
            ]
        )
            .then((data) => res.status(200).send(data))
            .catch((error) => res.status(400).send(error))
    }
}