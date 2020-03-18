var expanse = mongoose.model('masterexpanse');
module.exports = {
    insertupdate(req, res) {
        console.log(req.session.branchid)
        if (!req.body.id) {
            expanse.findOne({ expansename: req.body.expansename.toLowerCase(), isdeleted: 0 })
                .then(exp => {
                    if (exp) {
                        return res.status(400).send('this Expanse already exist')
                    }
                    return expanse.create({
                            expansename: req.body.expansename.toLowerCase(),
                            description: req.body.description,
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
        } else {
            expanse.findById(req.body.id)
                .then(data => {
                    return data.updateOne({
                            expansename: req.body.expansename.toLowerCase(),
                            description: req.body.description,
                            companyid: req.session.companyid,
                            branchid: req.session.branchid,
                            updatedby: req.session.usrid,
                            updateddate: new Date,
                        })
                        .then(data => {
                            res.status(200).send({
                                status: 'success',
                                message: 'Record Update SuccessFully',
                                data
                            })
                        })
                        .catch((error) => {
                            res.status(400).send({
                                status: 'failed',
                                message: error,
                            })
                        });
                })
        }
    },
    getlist(req, res) {
        expanse.findOne({ isdeleted: 0, _id: req.params.id })
            .then(data => { return res.status(200).send(data) })
            .catch(err => { return res.status(400).send(err) })
    },
    dropdownlist(req, res) {
        expanse.aggregate([{
                    $match: { "isdeleted": 0 }
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        name: "$expansename"
                    }
                }
            ])
            .then((data) => { res.status(200).send(data); })
            .catch((error) => res.status(400).send(error));
    },

    delete(req, res) {
        expanse.findById(req.params.id)
            .then(data => {
                return data.updateOne({
                        isdeleted: '1'
                    })
                    .then(data => {
                        res.status(200).send({
                            status: 'success',
                            message: 'Record Deleted SuccessFully',
                            data
                        })
                    })
                    .catch((error) => {
                        res.status(400).send({
                            status: 'failed',
                            message: error,
                        })
                    });
            })
    },
    list(req, res) {
        // console.log(req.body)
        var orderby = {};
        if (req.body['order[0][column]'] == '0') {
            if (req.body['order[0][dir]'] == 'asc') {
                orderby = { $sort: { expansename: -1 } };
            }
            else {
                orderby = { $sort: { expansename: 1 } };
            }
        } else if (req.body['order[0][column]'] == '1') {
            if (req.body['order[0][dir]'] == 'asc') {
                orderby = { $sort: { description: -1 } };
            }
            else {
                orderby = { $sort: { description: 1 } };
            }
        }
        var searchStr = req.body['search[value]'];
        if (req.body['search[value]']) {
            var regex = new RegExp(req.body['search[value]'], "i")
            searchStr = {
                $match: {
                    $or: [
                        // { '_id': regex },
                        { 'expansename': regex },
                    ],
                    isdeleted: 0,
                    companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    branchid: new mongoose.Types.ObjectId(req.session.branchid)
                }

            };
        } else {
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
        expanse.count({
                isdeleted: 0,
                companyid: new mongoose.Types.ObjectId(req.session.companyid),
                branchid: new mongoose.Types.ObjectId(req.session.branchid)
            })
            .then(c => {
                console.log('records total ' + c)
                recordsTotal = c;
                expanse.aggregate(
                    [
                        {
                            "$match": {
                               
                                "isdeleted": 0,
                                companyid: new mongoose.Types.ObjectId(req.session.companyid),
                                branchid: new mongoose.Types.ObjectId(req.session.branchid),
                               
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
                        recordsFiltered = (c = [] ? '0' :  c[0].COUNT);
                        expanse.aggregate([
                                searchStr,
                                orderby,
                                {
                                    $project: {
                                        "_id": 1,
                                        "expansename": 1,
                                        "description": 1,
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
    }
}