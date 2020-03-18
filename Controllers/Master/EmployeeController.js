const mongoose = require('mongoose');
var Employee = mongoose.model('MasterEmployee');
require("datejs");
require('../../config/logger');
var url = require('url');
module.exports = {
    insert(req, res) {
       
        if(req.body._id)
        {
            Employee.findById(req.body._id)
            .then((data)=>{
                if(!data){
                    return res.status(400).send({
                        status:'error',message:'Data is Not availble'
                    })
                }
                else{
                    data.updateOne({
                        empname: req.body.empname||data.empname,
                        deptid: req.body.deptid||data.deptid,
                        salary:req.body.salary||data.salary,
                        incentives: req.body.incentives||data.incentives,
                        doj:req.body.doj||data.doj,
                        others: req.body.others||data.others,
                        description:req.body.description||data.description,
                        companyid: req.session.companyid||data.companyid,
                        updatedby: req.session.usrid||data.usrid,
                        updateddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                        isdeleted: '0'
                    })
                    .then((data1)=>{
                        logger.log('info','logjson{ page : MasterEmployee, Acion : update,Process : Success,_id:'+req.body._id+',userid : '+req.session.usrid+',companyid :'+ req.session.companyid+',datetime: '+(new Date()).toString("yyyy-MM-dd HH:MM:ss"+'}'));
                        res.status(200).send({
                            status:'success', message : 'Record Update SuccessFully'
                           })
                    })
                }
            })
        }
        else
        {
            Employee.findOne({isdeleted:0,empname: req.body.empname, doj:req.body.doj})
            .then((data)=>{
                if(data)
                {
                    res.status(400).send('Employee name Already used')
                }
                else
                {
                    Employee.create({
                        empname: req.body.empname,
                        deptid: req.body.deptid,
                        salary:req.body.salary,
                        incentives: req.body.incentives,
                        doj:req.body.doj,
                        others: req.body.others,
                        description:req.body.description,
                        companyid: req.session.companyid,
                        createdby: req.session.usrid,
                        createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                        isdeleted: '0'
                    }).then((data) => {
                        logger.log('info','logjson{ page : MasterEmployee, Acion : Insert,Process : Success,userid : '+req.session.usrid+',companyid :'+ req.session.companyid+',datetime: '+(new Date()).toString("yyyy-MM-dd HH:MM:ss"+'}'));
                        res.status(200).send({
                            status: 'success',
                            message: 'record added successfully'
                        })
                    })
                    .catch((error) => {
                            res.status(400).send({
                                status: 'Error',
                                message: error
                            })
                        }
                    )

                }
            })
          
        }
     
    },
    list(req, res) {
        var queryString = url.parse(req.url, true);
        var urlparms = queryString.query;
        // console.log(urlparms);
        var orderby = {};
        if (urlparms['order[0][column]'] == '0') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { _id: -1 } };
            }
            else {
                orderby = { $sort: { _id: 1 } };
            }
        } else if (urlparms['order[0][column]'] == '1') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { empname: -1 } };
            }
            else {
                orderby = { $sort: { empname: 1 } };
            }
        } else if (urlparms['order[0][column]'] == '2') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { "Department.deptname": -1 } };
            }
            else {
                orderby = { $sort: { "Department.deptname": 1 } };
            }
           
        }else if (urlparms['order[0][column]'] == '3') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { description: -1 } };
            }
            else {
                orderby = { $sort: { description: 1 } };
            }
        }else if (urlparms['order[0][column]'] == '4') {
            if (urlparms['order[0][dir]'] == 'asc') {
                orderby = { $sort: { salary: -1 } };
            }
            else {
                orderby = { $sort: { salary: 1 } };
            }
        }
        
        //  console.log(urlparms);
         console.log(orderby);
         var searchStr = urlparms['search[value]'];
         if (urlparms['search[value]']) {
             var regex = new RegExp(urlparms['search[value]'], "i")
             searchStr = {
                 $match: {
                     $or: [
                         // { '_id': regex },
                         { 'empname': regex },
                         { 'salary': regex },
                         { 'description': regex },
                         
                     ],
                     isdeleted: 0,
                    //  companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    //  branchid: new mongoose.Types.ObjectId(req.session.branchid)
                 }
 
             };
         } else {
             searchStr = {
                 $match: {
                     isdeleted: 0,
                    //  companyid: new mongoose.Types.ObjectId(req.session.companyid),
                    //  branchid: new mongoose.Types.ObjectId(req.session.branchid)
                 }
             };
         }
         console.log(searchStr)
        var recordsTotal = 0;
        var recordsFiltered = 0;
        Employee.count({isdeleted : 0 }, function (err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            Employee.count({isdeleted:0}, function (err, c) {
                recordsFiltered = c;
                // console.log('record fliter count ' + c);
                // console.log('start ' + urlparms.start);
                // console.log('length ' + urlparms.length);
                Employee.aggregate(
                    [
                        searchStr,
                        orderby,
                        {
                            $lookup:
                            {
                                from: "masterdepartments",
                                "localField": "deptid",
                                "foreignField": "_id",
                                as: "Department"
                            }
                        },
                        {
                            $unwind: "$Department"
                        },
                        {
                            $project: {
                                "_id": 1,
                                "empname": 1,
                                "salary": 1,
                                "description": 1,
                                "Department.deptname":1
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
    getedit(req, res) {
        console.log(req.params._id);
        var id=req.params._id;
        Employee.aggregate(
            [
               
               {
                  $match:{_id:new mongoose.Types.ObjectId( req.params._id),isdeleted:0}
               },
              {
                $project: {
                    _id:1,
                    date: { $dateToString: { format: "%d-%m-%Y", date: "$doj" } },
                     empname:1,
                     deptid:1,
                     salary:1,
                     incentives:1,
                     others:1,
                     description:1
                }
              }
            ])
            .then((data) => {
              console.log(data)
                return res.status(200).send(data)
            })
            .catch((error) => {
                return res.status(400).send(error)
            })
    },
    deleterecord(req,res){
        Employee.findById(req.params._id)
        .then(data=>{
              if (!data) {
                return res.status(404).send({
                message: 'Data Not Found',
                });
            }
           return data.updateOne({
            isdeleted:1
           })
           .then((data1) => res.status(200).send({status:'Success', message : 'Record deleted SuccessFully',data1}))
           .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error));
    },
    employeeddllist(req, res) {
        Employee.aggregate([
            {
                $match: { "isdeleted": 0 }
            },
            {
                $project: {
                    _id:1,
                    id: '$_id',
                    name: '$empname',                   
                }
            }
        ])
            .then((data) =>  res.status(200).send( {data:data}))
            .catch((error) => res.status(400).send(error));
    },
}
