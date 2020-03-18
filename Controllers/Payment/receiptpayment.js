const ReceiptPayment = mongoose.model('ReceiptPayment');
const sales = mongoose.model('sales');
const Payment = mongoose.model('Payment');
module.exports = {
    insert(req, res) {

        if (req.body._id) {
            Payment.findById(req.body._id)
                .then((data) => {
                    data.updateOne({
                        billno: req.body.billno,
                        billdate: req.body.billdate,
                        type:"customer",
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
                       
                        companyid: req.session.companyid,
                        updatedby: req.session.usrid,
                        updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                        isdeleted: '0'
                    }).then((data) => {
                        logger.log('info', 'logjson{ page : ReceiptPayment, Acion : update,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
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
                type:"customer",
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
                companyid: req.session.companyid,
                createdby: req.session.usrid,
                createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                isdeleted: '0'
            }).then((data) => {
                logger.log('info', 'logjson{ page : ReceiptPayment, Acion : Insert,Process : Success,userid : ' + req.session.usrid + ',companyid :' + req.session.companyid + ',datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}'));
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
        var searchStr = {isdeleted : 0};
        var recordsTotal = 0;
        var recordsFiltered = 0;
        Payment.count({isdeleted : 0 }, function (err, c) {
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
                            $match: { "isdeleted": 0 ,type:"customer"}
                        },
                        {
                            $lookup:
                            {
                                from: "mastercustomers",
                                "localField": "typeid",
                                "foreignField": "_id",
                                as: "Customer"
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
                                    receiptno:  "$billno",
                                    receiptdate:{ $dateToString: { format: "%Y-%m-%d", date: "$billdate" } },
                                    paidamount:"$paidamount",
                                    customername:"$Customer.name",
                                    bankdetails:"$bankdetails.bankname",
                                    referencemode:"$referencemode"
                                },
                               // totalqty: { "$sum": "$payedamount" },
                                "count": { "$sum": 1 }
                            }

                        },
                       
                       
                        {
                            $project: {
                                //billdate:1,
                                _id:0,
                                receiptno:"$_id.receiptno",
                                receiptdate:"$_id.receiptdate",
                                paidamount:"$_id.paidamount",
                                customername:"$_id.customername",
                                method:"$_id.bankdetails",
                                referencemode:"$_id.referencemode"
                                
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
    edit(req,res){
        Payment.aggregate([
            {
                $match:{billno:req.params.receiptno,isdeleted:0,type:"customer"},
            },
            {
                $lookup:
                {
                    from: "mastercustomers",
                    "localField": "typeid",
                    "foreignField": "_id",
                    as: "customers"
                }
              },
              {
                $project: {
                    _id:1,
                    receiptdate:{ $dateToString: { format: "%d-%m-%Y", date: "$billdate" } },
                    receiptno:"$billno",
                    paidfrom:1,
                    referencemode:1,
                    "paidamount":1,
                    "reference": 1,
                    "customerid": "$typeid",
                    "customers.name":1,
                    invoiceno:"$trans_no",
                    invoicedate:{ $dateToString: { format: "%d-%m-%Y", date: "$trans_date" } },
                    sale_id:"$trans_id",
                    payedamount:1,
                    balance:1,
                 }
              }
        ])
        .then((data)=>res.status(200).send(data))
        .catch((err)=>res.status(400).send(err))
    },
    delete(req,res){
        Payment.find({isdeleted:0,billno:req.params.receiptno,type:"customer"})
        .then((data)=>{
           
            data.forEach((ele)=>{
               

                Payment.findById(ele._id)
                .then((data2)=>{
                    data2.updateOne({
                        isdeleted:1
                    }).then((data3)=>{})
                })

 
            })
            res.status(200).send({
           
                status: 'success',
                message: 'record delete successfully',
                
            })
        })
        .catch((err)=>res.status(400).send(err))
    },
    CustomerBalanceDetails(req, res) {
        sales.aggregate([
            {
                $match: { isdeleted: 0, customerid: new mongoose.Types.ObjectId(req.params.id) }
            },
            {
                $lookup:
                {
                    from: "salereturns",
                    "let": { "id": "$_id" },
                    "pipeline": [
                        {
                            "$match": {
                                isdeleted: 0,
                                "$expr": {
                                    $and:
                                        [
                                            { $eq: ["$sale_id", "$$id"] },
                                        ]
                                },
                            }
                        }
                    ],
                    as: "salereturn",
                }
            },
            {
                $lookup: {

                    from: "payments",
                    "let": { "sale_id": "$_id" },
                    "pipeline": [
                        {
                            "$match": {
                                isdeleted: 0,type:"customer",
                                "$expr": {
                                    $and:
                                        [
                                            { $eq: ["$trans_id", "$$sale_id"] },
                                        ]
                                },
                            }
                        }
                    ],
                    as: "receiptpayment",
                }
            },
            {
                $project: {
                    _id: 1,
                    'salereturn._id': 1,
                    'salereturn.sale_id': 1,
                    'salereturn.total': 1,
                    // 'creditdays':1,
                    'invoiceno': 1,
                    "invoicedate": { $dateToString: { format: "%d-%m-%Y", date: "$invoicedate" } },
                    "receiptpayment.balance": 1,
                    'total': 1,
                    'balance': { $subtract: ['$total', { $add: [{ "$sum": '$salereturn.total' }, { "$sum": '$receiptpayment.payedamount' }] }] }

                }
            }

        ])
            .then((data) => { res.status(200).send(data) })
    },
    receiptno(req,res){
        Payment.aggregate( [
            {
                $match: {type:"customer" }
            },
            {
                $lookup:
                {
                    from: "mastercustomers",
                    "localField": "typeid",
                    "foreignField": "_id",
                    as: "Customer"
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
                        receiptno:  "$billno",
                        receiptdate:{ $dateToString: { format: "%Y-%m-%d", date: "$billdate" } },
                         paidamount:"$paidamount",
                        customername:"$Customer.name",
                        bankdetails:"$bankdetails.bankname",
                        referencemode:"$referencemode"
                    },
                   // totalqty: { "$sum": "$payedamount" },
                    "count": { "$sum": 1 }
                }

            },
           
           
       
           
            { $count: "myCount" }
         ])
          .then((data)=>{
              res.status(200).send({billno:data.length==0?1:data[0].myCount+1})
            })
              .catch((error)=>res.status(400).send(error))
        },

}