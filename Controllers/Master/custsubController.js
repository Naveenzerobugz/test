
var customer = mongoose.model('mastercustomer');
var supplier = mongoose.model('mastersupplier');
module.exports = {
    insercustomer(req, res) {
        customer.findOne({ mobile: req.body.mobile })
            .then(cust => {
                if (cust) {
                    return res.status(400).send('this customer already exist')
                }
                return customer.create({
                    name: req.body.name,
                    mobile: req.body.mobile,
                    openingbalance: '0.00',
                    companyid: req.session.companyid,
                    branchid: req.session.branchid,
                    createdby: req.session.usrid,
                })
                    .then(data => {
                        res.status(200).send({ status: 'success', message: 'Customer added successfully', data })
                    })
                    .catch(error => {
                        console.log(error)
                        res.status(400).send(error)
                    })
            })
    },
    insertupdate(req, res) {
        if (!req.body.id) {
            // console.log(req.body)
            if (req.body.pagetype == 'customer') {
                customer.findOne({ mobile: req.body.mobile })
                    .then(cust => {
                        if (cust) {
                            return res.status(400).send('this customer already exist')
                        }
                        console.log(req.session.branchid)
                        return customer.create({
                            name: req.body.name,
                            mobile: req.body.mobile,
                            openingbalance: req.body.openingbalance,
                            paymentterms: req.body.paymentterms,
                            customertype: req.body.customertype,
                            companyname: req.body.companyname,
                            email: req.body.email,
                            others: req.body.others,
                            description: req.body.description,
                            gsttype: req.body.gsttype,
                            gstin: req.body.gstin,
                            panno: req.body.panno,
                            billingaddress: req.body.billingaddress,
                            billingstate: req.body.billingstate,
                            billingpincode: req.body.billingpincode,
                            shippingaddress: req.body.shippingaddress,
                            shippingstate: req.body.shippingstate,
                            shippingpincode: req.body.shippingpincode,

                            companyid: req.session.companyid,
                            branchid: req.session.branchid,
                            createdby: req.session.usrid,
                        })
                            .then(data => {
                                res.status(200).send({ status: 'success', message: 'Record added successfully', data })
                            })
                            .catch(error => {
                                console.log(error)
                                res.status(400).send(error)
                            })
                    })
            } else if (req.body.pagetype == 'supllier') {
                console.log('---------------supplier----------------------')
                supplier.findOne({ mobile: req.body.mobile }
                )
                    .then(sub => {
                        if (sub) {
                            return res.status(400).send('this supplier already exist')
                        }
                        return supplier.create({
                            name: req.body.name,
                            mobile: req.body.mobile,
                            openingbalance: req.body.openingbalance,
                            paymentterms: req.body.paymentterms,
                            customertype: req.body.customertype,
                            companyname: req.body.companyname,
                            email: req.body.email,
                            others: req.body.others,
                            description: req.body.description,
                            gsttype: req.body.gsttype,
                            gstin: req.body.gstin,
                            panno: req.body.panno,
                            billingaddress: req.body.billingaddress,
                            billingstate: req.body.billingstate,
                            billingpincode: req.body.billingpincode,
                            shippingaddress: req.body.shippingaddress,
                            shippingstate: req.body.shippingstate,
                            shippingpincode: req.body.shippingpincode,

                            companyid: req.session.companyid,
                            branchid: req.session.branchid,
                            createdby: req.session.usrid,
                        })
                            .then(data => {
                                res.status(200).send({ status: 'success', message: 'Record added successfully', data })
                            })
                            .catch(error => {
                                console.log(error)
                                res.status(400).send(errorq)
                            })
                    })
            }
        } else {
            if (req.body.pagetype == 'customer') {
                // console.log(req.body)
                customer.findById(req.body.id)
                    .then(cust => {
                        console.log(cust)
                        return cust.updateOne({
                            name: req.body.name,
                            mobile: req.body.mobile,
                            openingbalance: req.body.openingbalance,
                            paymentterms: req.body.paymentterms,
                            customertype: req.body.customertype,
                            companyname: req.body.companyname,
                            email: req.body.email,
                            others: req.body.others,
                            description: req.body.description,
                            gsttype: req.body.gsttype,
                            gstin: req.body.gstin,
                            panno: req.body.panno,
                            billingaddress: req.body.billingaddress,
                            billingstate: req.body.billingstate,
                            billingpincode: req.body.billingpincode,
                            shippingaddress: req.body.shippingaddress,
                            shippingstate: req.body.shippingstate,
                            shippingpincode: req.body.shippingpincode,
                            updatedby: req.session.usrid,
                            updateddate: new Date,
                        })
                            .then(data => {
                                res.status(200).send({
                                    status: 'success', message: 'Record Update SuccessFully', data
                                })
                            })
                            .catch((error) => {
                                res.status(400).send({
                                    status: 'failed', message: error,
                                })
                            });
                    })
            } else if (req.body.pagetype == 'supllier') {
                supplier.findById(req.body.id)
                    .then(cust => {
                        return cust.updateOne({
                            name: req.body.name,
                            mobile: req.body.mobile,
                            openingbalance: req.body.openingbalance,
                            paymentterms: req.body.paymentterms,
                            customertype: req.body.customertype,
                            companyname: req.body.companyname,
                            email: req.body.email,
                            others: req.body.others,
                            description: req.body.description,
                            gsttype: req.body.gsttype,
                            gstin: req.body.gstin,
                            panno: req.body.panno,
                            billingaddress: req.body.billingaddress,
                            billingstate: req.body.billingstate,
                            billingpincode: req.body.billingpincode,
                            shippingaddress: req.body.shippingaddress,
                            shippingstate: req.body.shippingstate,
                            shippingpincode: req.body.shippingpincode,
                            updatedby: req.session.usrid,
                            updateddate: new Date,
                        })
                            .then(data => {
                                res.status(200).send({
                                    status: 'success', message: 'Record Update SuccessFully', data
                                })
                            })
                            .catch((error) => {
                                res.status(400).send({
                                    status: 'failed', message: error,
                                })
                            });
                    })
            }
        }

    },
    list(req, res) {
        // var queryString = url.parse(req.url, true);
        // var urlparms = queryString.query;
        console.log(req.body)
        var orderby = {};
        console.log(req.body['order[0][dir]'])
        if (req.body['order[0][column]'] == '0') {
            if (req.body['order[0][dir]'] == 'asc') {
                orderby = { $sort: { _id: -1 } };
            }
            else {
                orderby = { $sort: { _id: 1 } };
            }
        } else if (req.body['order[0][column]'] == '1') {
            if (req.body['order[0][dir]'] == 'asc') {
                orderby = { $sort: { name: -1 } };
            }
            else {
                orderby = { $sort: { name: 1 } };
            }
        } else if (req.body['order[0][column]'] == '2') {
            if (req.body['order[0][dir]'] == 'asc') {
                orderby = { $sort: { mobile: -1 } };
            }
            else {
                orderby = { $sort: { mobile: 1 } };
            }
        }
        else if (req.body['order[0][column]'] == '6') {
            if (req.body['order[0][dir]'] == 'asc') {
                orderby = { $sort: { companyname: -1 } };
            }
            else {
                orderby = { $sort: { companyname: 1 } };
            }
        }
        else if (req.body['order[0][column]'] == '7') {
            if (req.body['order[0][dir]'] == 'asc') {
                orderby = { $sort: { billingstate: -1 } };
            }
            else {
                orderby = { $sort: { billingstate: 1 } };
            }
        }


        console.log(orderby)
        var searchStr = req.body['search[value]'];
        if (req.body['search[value]']) {
            var regex = new RegExp(req.body['search[value]'], "i")
            searchStr = {

                $match: {
                    $or: [
                        { '_id': regex },
                        { 'name': regex },
                        { 'mobile': regex },
                        { 'companyname': regex },
                        { 'billingstate': regex },
                    ],
                    isdeleted: 0,
                    companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    branchid: new mongoose.Types.ObjectId(req.session.branchid)
                }

            };
        }
        else {
            searchStr = {
                $match: {
                    isdeleted: 0,
                    companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    branchid: new mongoose.Types.ObjectId(req.session.branchid)
                }
            };
        }
        var recordsTotal = 0;
        var recordsFiltered = 0;
        if (req.body.pagetype == 'customer') {
            customer.count({
                isdeleted: 0,
                companyid: new mongoose.Types.ObjectId(req.session.companyid),
                branchid: new mongoose.Types.ObjectId(req.session.branchid)
            })
                .then(c => {
                    recordsTotal = c;
                    customer.count({
                        isdeleted: 0,
                        companyid: new mongoose.Types.ObjectId(req.session.companyid),
                        branchid: new mongoose.Types.ObjectId(req.session.branchid)
                    })
                        .then(c => {
                            recordsFiltered = c; //c[0].count;
                            customer.aggregate([

                                searchStr,
                                orderby,
                                {
                                    $project: {
                                        "_id": 1,
                                        "name": 1,
                                        "mobile": 1,
                                        "openingbalance": 1,
                                        "paymentterms": 1,
                                        "customertype": 1,
                                        "companyname": 1,
                                        "billingstate": 1,
                                    }
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
        } else if (req.body.pagetype == 'supllier') {
            supplier.count({
                isdeleted: 0,
                companyid: new mongoose.Types.ObjectId(req.session.companyid),
                branchid: new mongoose.Types.ObjectId(req.session.branchid)
            })
                .then(c => {
                    recordsTotal = c;
                    supplier.count({
                        isdeleted: 0,
                        companyid: new mongoose.Types.ObjectId(req.session.companyid),
                        branchid: new mongoose.Types.ObjectId(req.session.branchid)
                    }
                        //     [
                        //     // searchStr,
                        //     // { $group: { _id: null, count: { $sum: 1 } } }
                        // ]
                    )
                        .then(c => {
                            recordsFiltered = c;//c[0].count;
                            supplier.aggregate([

                                searchStr,
                                orderby,
                                {
                                    $project: {
                                        "_id": 1,
                                        "name": 1,
                                        "mobile": 1,
                                        "openingbalance": 1,
                                        "paymentterms": 1,
                                        "customertype": 1,
                                        "companyname": 1,
                                        "billingstate": 1,
                                    }
                                },
                                { "$skip": Number(req.body.start), },
                                { "$limit": Number(req.body.length) },
                            ]).then(results => {
                                console.log(results)
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

    },
    test(req, res) {
        console.log(req.session.branchid)
        customer.aggregate([
            {
                $match: {
                    isdeleted: 0,
                    companyid: new mongoose.Types.ObjectId('5e341a648bcf8086cc251719'),
                    branchid: new mongoose.Types.ObjectId('5e341a648bcf8086cc25171a')
                }
            }, {
                $project: {
                    "_id": 1,
                    "name": 1,
                    "mobile": 1,
                    "openingbalance": 1,
                    "paymentterms": 1,
                    "customertype": 1,
                    "companyname": 1,
                    "billingstate": 1,
                }
            },
            { "$skip": Number(0), },
            { "$limit": Number(10) },
        ])
            .then(data => {
                res.send(data)
            })
    },
    custgetlist(req, res) {
        customer.findOne({ isdeleted: 0, _id: req.params.id })
            .then(data => { return res.status(200).send(data) })
            .catch(err => { return res.status(400).send(err) })
    },
    supgetlist(req, res) {
        supplier.findOne({ isdeleted: 0, _id: req.params.id })
            .then(data => { return res.status(200).send(data) })
            .catch(err => { return res.status(400).send(err) })
    },
    delete(req, res) {
        if (req.body.pagetype == 'customer') {
            // console.log(req.body)
            customer.findById(req.body.id)
                .then(cust => {
                    console.log(cust)
                    return cust.updateOne({
                        isdeleted: '1'
                    })
                        .then(data => {
                            res.status(200).send({
                                status: 'success', message: 'Record Deleted SuccessFully', data
                            })
                        })
                        .catch((error) => {
                            res.status(400).send({
                                status: 'failed', message: error,
                            })
                        });
                })
        } else if (req.body.pagetype == 'supllier') {
            supplier.findById(req.body.id)
                .then(cust => {
                    return cust.updateOne({
                        isdeleted: '1'
                    })
                        .then(data => {
                            res.status(200).send({
                                status: 'success', message: 'Record Deleted SuccessFully', data
                            })
                        })
                        .catch((error) => {
                            res.status(400).send({
                                status: 'failed', message: error,
                            })
                        });
                })
        }
    },
    supplierdropdownlist(req, res) {
        supplier.aggregate([
            {
                $match: { "isdeleted": 0 }
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    name: 1,
                    gstin: 1,
                    billingstate: 1,
                    shippingstate: 1,
                }
            }
        ])
            .then((data) => res.status(200).send(data))
            .catch((error) => res.status(400).send(error));
    },
    customerdropdownlist(req, res) {
        customer.aggregate([
            {
                $match: { "isdeleted": 0 }
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    name: 1,
                    gstin: 1,
                    billingstate: 1,
                    shippingstate: 1,
                    customertype: 1,
                    email: 1,
                    shippingaddress: 1,
                    billingaddress: 1,
                    gstin: 1,
                    gsttype: 1,
                    gstno: 1,
                    paymentterms:1,
                }
            }
        ])
            .then((data) => res.status(200).send(data))
            .catch((error) => res.status(400).send(error));
    },
};