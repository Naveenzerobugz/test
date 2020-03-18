var sales = mongoose.model('sales');
var SaleReturn = mongoose.model('SaleReturn');
var Product = mongoose.model('MasterProduct');
require("datejs");
require('../../config/logger');
module.exports={
    insert(req, res) {
            if(!req.body._id)
            {
                    SaleReturn.create({
                        invoicereturn_no: req.body.invoicereturnno,
                        sale_id:req.body.sale_id,
                        invoicedate: req.body.invoicedate,
                        invoiceno:req.body.invoiceno,
                        reference: req.body.reference,
                        customerid: req.body.customerid,
                        subtotal:req.body.subtotal,
                        roundoff:req.body.roundoff,
                        total:req.body.total,
                        invoiceReturnDetail:req.body.invoiceReturnDetail,
                        gstdetail:req.body.gstdetail,
                        hsncolumn: req.body.hsncolumn,
                        unitcolumn: req.body.unitcolumn,
                        discountcolumn: req.body.discountcolumn,
                        discountype:req.body.discountype,
                        taxtype:req.body.taxtype,
                        companyid: req.session.companyid,
                        createdby: req.session.usrid,
                        createddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                        isdeleted: '0'
                    }).then((data) => {
                       
                         req.body.invoiceReturnDetail.forEach((update)=>{
                            Product.findById(update.productid)
                            .then((productdata)=>{
                                if (!productdata) {
                                    return res.status(404).send({
                                        message: 'Data Not Found',
                                    });
                                }
                                console.log(productdata);
                               productdata.updateOne({
                                    stockinhand:((parseInt(productdata.stockinhand) +  parseInt(update.qty)))
                                }).then((data5)=>{})
                            })
                       
                        })
                        logger.log('info','logjson{ page : SaleReturn, Acion : Insert,Process : Success,userid : '+req.session.usrid+',companyid :'+ req.session.companyid+',datetime: '+(new Date()).toString("yyyy-MM-dd HH:MM:ss"+'}'));
                        res.status(200).send({
                            status: 'success',
                            message: 'record added successfully',
                            
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
            else
            {
           
                let salereturnData=[];
                SaleReturn.findById(req.body._id)
                .then(data=>{
                      if (!data) {
                        return res.status(404).send({
                        message: 'Data Not Found',
                        });
                    }
                     req.body.invoiceReturnDetail.forEach((srele)=>{
                        data.invoiceReturnDetail.forEach((oele)=>{
                            if(srele.invoicedetail_id=oele._id)
                            {
                                Product.findById(srele.productid)
                                .then((data5)=>{
                                    console.log()
                                     data5.updateOne({
                                        stockinhand:(parseInt(data5.stockinhand)-parseInt(oele.qty))+parseInt(srele.qty)
                                    }).then((dat8)=>{})
                                })
                                // console.log('purchaseqty:'+pele.qty)
                            }
                        })
                      })
                   
                    data.updateOne({
                        subtotal:req.body.subtotal,
                        roundoff:req.body.roundoff,
                        total:req.body.total,
                        invoiceReturnDetail:req.body.invoiceReturnDetail,
                        hsncolumn: req.body.hsncolumn,
                        unitcolumn: req.body.unitcolumn,
                        discountcolumn: req.body.discountcolumn,
                        discountype:req.body.discountype,
                        taxtype:req.body.taxtype,
                        gstdetail:req.body.gstdetail,
                        companyid: req.session.companyid,
                        modifiedby: req.session.usrid,
                        modifieddate: (new Date()).toString("yyyy-MM-dd HH:MM:ss"),
                      
                    })
                    .then((data2)=>{res.status(200).send(

                        {status:'success',message:'Record Updated success'}
                        )})
                    .catch((err)=>res.status(400).send(err))
                  
                })
              
            }
    },
    list(req, res) {
        console.log(req.url);
        var queryString = url.parse(req.url, true);
        var urlparms = queryString.query;
        // console.log(urlparms);
        var searchStr = {isdeleted : 0};
        var recordsTotal = 0;
        var recordsFiltered = 0;
        SaleReturn.count({isdeleted : 0 }, function (err, c) {
            recordsTotal = c;
            console.log('total count ' + c);
            SaleReturn.count(searchStr, function (err, c) {
                recordsFiltered = c;
                console.log('record fliter count ' + c);
                console.log('start ' + urlparms.start);
                console.log('length ' + urlparms.length);
                SaleReturn.aggregate(
                    [
                        {
                            $match: { "isdeleted": 0 }
                        },
                        {
                            $lookup:
                            {
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
                                "_id": 1,
                                "invoicedate": { $dateToString: { format: "%Y-%m-%d", date: "$invoicedate" } },
                                "returndate": { $dateToString: { format: "%Y-%m-%d", date: "$createddate" } },
                                "customer.name": 1,
                                "invoicereturn_no": 1,
                                "total": 1,
                            },
                           
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
        var id=req.params._id;
        SaleReturn.aggregate(
            [
               {
                  $match:{_id:new mongoose.Types.ObjectId( req.params._id),isdeleted:0}
               },
               {
                $lookup:
                {
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
                    $lookup:
                    {
                        from: "masterproducts",
                        "localField": "invoiceRetrunDetail.productid",
                        "foreignField": "_id",
                        as: "productdetail"
                    }
                },
              {
                $project: {
                    _id:1,
                    "invoicedate":{ $dateToString: { format: "%d-%m-%Y", date: "$invoicedate" } },
                    "customerid": 1,
                    "customer.name": 1,
                    "customer.gstin": 1,
                    "customer.billingstate": 1,
                    "invoicereturn_no":1,
                    invoiceno:1,
                    "sale_id":1,
                    "total":1,
                    "invoiceReturnDetail":1,
                    "productdetail.productname":1,
                    "productdetail._id":1,
                    "unitcolumn":1,
                    "hsncolumn":1,
                    "discountcolumn":1,
                    "roundoff":1,
                    "discountype":1,
                    "taxtype":1,
                   
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
    salesretrunno(req,res){
        SaleReturn.aggregate( [
            {$match:{isdeleted : 0 }},
            { $count: "myCount" }
         ])
          .then((data)=>{
             
            res.status(200).send({billno:data.length==0?1:data[0].myCount+1})
            })
          .catch((error)=>res.status(400).send(error))
      
         
    },
    delete(req,res){
      
        SaleReturn.findById(req.params._id)
        .then(data=>{
              if (!data) {
                return res.status(404).send({
                message: 'Data Not Found',
                });
            }
         
            data.invoiceReturnDetail.forEach((ele)=>{
                
               Product.findById(ele.productid)
                    .then((productdata)=>{
                         if (!productdata) {
                             return res.status(404).send({
                                     message: 'Data Not Found',
                             });
                        }
                       
                         productdata.updateOne({
                             stockinhand:parseInt(productdata.stockinhand) - parseInt(ele.qty)
                             }).then((data1)=>{})
                         })
                })
                data.updateOne({
                    isdeleted:1
                 })
                .then((data)=>res.status(200).send({status:'success',message:'Record delete successfully'}))
                 .catch((err)=>res.status(400).send(err))
          
        })
        .catch((error) => res.status(400).send(error));
  
          
        
    },
    saledetails(req, res) {
        let count = 0;
        SaleReturn.countDocuments({ isdeleted: 0, _id: new mongoose.Types.ObjectId(req.params._id) })
            .then((data) => {
                if (data == 0) {

                    sales.aggregate([
                        {
                            $match: { _id: new mongoose.Types.ObjectId(req.params._id), isdeleted: 0 }
                        },
                        {
                            $lookup:
                            {
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
                            $lookup:
                            {
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
                                "productdetail.productname": 1,
                                "productdetail._id": 1,
                                "unitcolumn": 1,
                                "hsncolumn": 1,
                                "discountcolumn": 1,
                                "roundoff": 1,
                                "discountype": 1,
                                "taxtype": 1,
                                "salesrep":1,
                            }
                        }
                    ])
                        .then((data) => {
                            return res.status(200).send(data)
                        })
                        .catch((error) => {
                            return res.status(400).send(error)
                        })

                }
                else {
                    return res.status(400).send({
                        Message: 'Invoice No Already Used',
                    });
                }
            })

    },
   
}