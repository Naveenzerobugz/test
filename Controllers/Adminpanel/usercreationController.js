const mongoose = require('mongoose');
var UserCreation = mongoose.model('UserCreation');
var Role = mongoose.model('Role');
var Demo1 = mongoose.model('Demo1');
var Demo2 = mongoose.model('Demo2');

require('../../config/logger');
module.exports = {
    insert(req, res) {

        if (req.body._id) {
            UserCreation.findById(req.body._id)
                .then(data => {
                    if (!data) {
                        return res.status(400).send({
                            status: 'error', messag: 'something went wrong'
                        })
                    }
                    return data.updateOne({
                        name: req.body.name,
                        mobile: req.body.mobile,
                        email: req.body.email,
                        username: req.body.username,
                        password: req.body.password,
                        profilepic: req.files[0] == undefined ? req.body.profilepic : "/appfiles/userimages/" + req.files[0].originalname,
                        roleid: req.body.roleid,
                        branchid: req.session.branchid,
                        companyid: req.session.companyid
                    })
                        .then((data1) => {
                            logger.log('info', 'logjson{ page : UserCreation,\
                        Acion : update,\
                        Process : Success,\
                        _id:'+ req.body._id + ',\
                        userid : '+ req.session.usrid + ',\
                        branchid : '+ req.session.branchid + ',\
                        companyid : '+ req.session.companyid + ',\
                        datetime: '+ (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}')
                            );
                            res.status(200).send({
                                status: 'success', message: 'Record Update SuccessFully', data1
                            })

                        })
                        .catch((error) => {
                            logger.log('error', 'logjson{ page : UserCreation,' +
                                'Acion : Update,' +
                                'Process : Faield,' +
                                '_id:' + req.body.id + ',' +
                                'userid : ' + req.session.usrid + ',' +
                                'branchid : ' + req.session.branchid + ',' +
                                'companyid : ' + req.session.companyid + ',' +
                                error +
                                'datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}')
                            );
                            res.status(400).send(error)
                        });
                })
        } else {
            UserCreation.create({
                name: req.body.name,
                mobile: req.body.mobile,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                profilepic: req.files[0] == undefined ? req.body.profilepic : "/appfiles/userimages/" + req.files[0].originalname,
                roleid: req.body.roleid,
                branchid:req.session.branchid,
                companyid: req.session.companyid
            }).then((data) => {
                logger.log('info', 'logjson{ page : UserCreation,' +
                    'Acion : Insert,' +
                    'Process : Success,' +
                    '_id:' + data._id + ',' +
                    'userid : ' + req.session.usrid + ',' +
                    'branchid : ' + req.session.branchid + ',' +
                   'companyid : ' + req.session.companyid + ',' +
                    'datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}')
                );
                return res.status(200).send({
                    status: 'success',
                    message: 'User Added Successfully',
                    data
                })
            }).catch((error) => {
                logger.log('error', 'logjson{ page : UserCreation,' +
                    'Acion : Insert,' +
                    'Process : Faield,' +
                    '_id:null,' +
                    'userid : ' + req.session.usrid + ',' +
                    'branchid : ' + req.session.branchid + ',' +
                    'companyid : ' + req.session.companyid + ',' +
                    error +
                    'datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}')
                );
                return res.status(400).send({
                    status: 'Error',
                    message: error
                })
            })
        }

    },
    userupdate(req, res) {
        UserCreation.findById({ _id: req.body._id, password: req.body.currentpassword })
            .then(data => {
                if (!data) {
                    return res.status(400).send({
                        status: 'error', messag: 'something went wrong'
                    })
                }
                console.log('-----------------userupdate------------')
                console.log(data)
                return data.updateOne({
                    name: req.body.name,
                    mobile: req.body.mobile,
                    email: req.body.email,
                    password: req.body.password,
                    profilepic: req.files[0] == undefined ? req.body.profilepic : "/appfiles/userimages/" + req.files[0].originalname,
                })
                    .then((data1) => {
                        logger.log('info', 'logjson{ page : UserCreation,' +
                            'Acion : update,' +
                            'Process : Success,' +
                            '_id:' + req.body._id + ',' +
                            'userid : ' + req.session.usrid + ',' +
                            'branchid : ' + req.session.branchid + ',' +
                            'companyid : ' + req.session.companyid + ',' +
                            'datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}')
                        );
                        res.status(200).send({
                            status: 'success', message: 'Record Update SuccessFully', data1
                        })
                    })
                    .catch((error) => {
                        logger.log('error', 'logjson{ page : UserCreation,' +
                            'Acion : Update,' +
                            'Process : Faield,' +
                            '_id:' + req.body.id + ',' +
                            'userid : ' + req.session.usrid + ',' +
                            'branchid : ' + req.session.branchid + ',' +
                            'companyid : ' + req.session.companyid + ',' +
                            error +
                            'datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}')
                        );
                        res.status(400).send(error)
                    });
            })
    },
    list(req, res) {
        console.log(req.url);
        var queryString = url.parse(req.url, true);
        var urlparms = queryString.query;

        var searchStr = { isdeleted: 0 };
        var recordsTotal = 0;
        var recordsFiltered = 0;
        UserCreation.count({ isdeleted: 0 }, function (err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            UserCreation.count(searchStr, function (err, c) {
                recordsFiltered = c;
                console.log('record fliter count ' + c);
                console.log('start ' + urlparms.start);
                console.log('length ' + urlparms.length);
                UserCreation.aggregate(
                    [
                        {
                            $match: { "isdeleted": 0 }
                        },
                        {
                            $lookup:
                            {
                                from: "roles",
                                "localField": "roleid",
                                "foreignField": "_id",
                                as: "Role"
                            }
                        },
                        {
                            $unwind: "$Role"
                        },
                        {
                            $project: {
                                "_id": 1,
                                "name": 1,
                                "mobile": 1,
                                "email": 1,
                                "username": 1,
                                "password": 1,
                                "profilepic": 1,
                                "Role.rolename": 1,

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
    userlist(req, res) {
        var queryString = url.parse(req.url, true);
        var urlparms = queryString.query;

        console.log(urlparms);


        console.log('----------------------here coming---------------------------')

        //console.log('record search '+Object.query.search[value]);
        var searchStr = {};

        // if(query.search)
        // {
        //         var regex = new RegExp(query.search, "i")
        //         searchStr = { $or: [{'_id':regex },{'name': regex},{'mobile': regex },{'email': regex },{'username': regex },{'password': regex }] };
        // }
        // else
        // {
        //      searchStr={};
        // }
        var recordsTotal = 0;
        var recordsFiltered = 0;
        UserCreation.count({ isdeleted: 0 }, function (err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            UserCreation.count(searchStr, function (err, c) {
                recordsFiltered = c;
                console.log('record fliter count ' + c);
                console.log('start ' + urlparms.start);
                console.log('length ' + urlparms.length);
                UserCreation.find(searchStr, '_id name mobile email username password profilepic', { 'skip': Number(urlparms.start), 'limit': Number(urlparms.length) }, function (err, results) {
                    if (err) {
                        console.log('error while getting results' + err);
                        return;
                    }
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
    getlist(req, res) {

        UserCreation.find(
            { isdeleted: 0, _id: req.params.id },
            '_id name mobile email username password profilepic roleid'
        )
            .then((data) => {
                return res.status(200).send(data)
            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    deleterecord(req, res) {
        UserCreation.findById(req.params.id)
            .then(data => {
                if (!data) {
                    return res.status(404).send({
                        message: 'Data Not Found',
                    });
                }
                return data.updateOne({
                    isdeleted: 1
                })
                    .then((data1) => {
                        logger.log('info', 'logjson{ page : UserCreation,' +
                            'Acion : Delete,' +
                            'Process : Success,' +
                            '_id:' + req.params.id + ',' +
                            'userid : ' + req.session.usrid + ',' +
                            'branchid : ' + req.session.branchid + ',' +
                            'companyid : ' + req.session.companyid + ',' +
                            'datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}')
                        );
                        return res.status(200).send({ status: 'Success', message: 'Record deleted SuccessFully', data1 })
                    })
                    .catch((error) => {
                        logger.log('error', 'logjson{ page : UserCreation,' +
                            'Acion : Delete,' +
                            'Process : Faield,' +
                            '_id:' + req.params.id + ',' +
                            'userid : ' + req.session.usrid + ',' +
                            'branchid : ' + req.session.branchid + ',' +
                            'companyid : ' + req.session.companyid + ',' +
                            error +
                            'datetime: ' + (new Date()).toString("yyyy-MM-dd HH:MM:ss" + '}')
                        );
                        res.status(400).send(error)
                    });
            })
            .catch((error) => res.status(400).send(error));
    },
    joininrole(req, res) {
        UserCreation.aggregate([

            {
                $lookup:
                {
                    from: "roles",
                    "localField": "roleid",
                    "foreignField": "_id",
                    as: "Role"
                }

            },
            {
                $unwind: "$Role"
            },
            {
                $project: {
                    "_id": 1,
                    "name": 1,
                    "mobile": 1,
                    "email": 1,
                    "Role.rolename": 1,
                }
            }
        ]).then((Data) => res.status(200).send(Data))
            .catch((error) => res.status(400).send(error))

    },
}