require('../config/db');

var express = require('express');
var router = express();
var engine = require('ejs-locals');
router.engine('ejs', engine);
router.set('view engine', 'ejs');
var filename = '';
var multer  =   require('multer'); 
require("datejs");
const winston = require('winston')
const logconfig={
    'transports':[
        new winston.transports.File({
            filename:`./logs/${(new Date()).toString("yyyy-MM-dd")}.log`,
        })
    ]
}

const logger = winston.createLogger(logconfig);

var storage =   multer.diskStorage({  
    destination: function (req, file, callback) {  
      callback(null, './public/appfiles/companyimages/');  
    },  
    filename: function (req, file, callback) { 
      
      callback(null,file.originalname);  
    }  
  }); 
  var store =   multer.diskStorage({  
    destination: function (req, file, callback) {  
      callback(null, './public/appfiles/userimages/');  
    },  
    filename: function (req, file, callback) { 
      
      callback(null,file.originalname);  
    }  
  }); 
  const mongoose = require('mongoose');
  var MasterCompany = mongoose.model('MasterCompany');
  const ModelBranch=mongoose.model('Branch');
  var usercreation = require('../Controllers').usercreation;
  var Role = require('../Controllers').Role;
  var Branch=require('../Controllers').Branch;

  var uploading = multer({ storage : storage});
  var upload = multer({ storage : store});


  router.post('/usercreation', upload.any(),usercreation.insert);

  router.get('/usercreationlist',usercreation.list);
  router.post('/rolejoin',usercreation.joininrole);

  router.post('/roleinsert',Role.insert);
  router.get('/rolelist',Role.list);
  router.get('/roleddllist',Role.dropdownlist);
  router.get('/roleedit/:id',Role.edit);
  router.post('/roleinsert/:id',Role.update);
  router.post('/roledelete/:id',Role.softdelete);


  router.post('/branchinsert',uploading.any(),Branch.insert);
  router.get('/branchlist',Branch.list);
  router.get('/branchedit/:id',Branch.edit);
  router.post('/branchupdate',uploading.any(),Branch.update);
  router.post('/branchdelete/:id',Branch.softdelete);

  router.post('/usercreation', upload.any(),usercreation.insert)
  router.post('/userupdate', upload.any(),usercreation.userupdate)
  router.get('/usercreationlist',usercreation.list)
  router.get('/userlist',usercreation.userlist)
  router.get('/userlist/:id',usercreation.getlist)
  router.post('/userdelete/:id',usercreation.deleterecord)

  router.post('/companysave', uploading.any(),function(req, res) {
     try
     {
      let type='';
      MasterCompany.estimatedDocumentCount({})
      .then((data)=>{
        
             if(data=='0') {
               type='main'
             }
             else{
               type='sub'
             }
             MasterCompany.create({
               companyname:req.body.companyname,
               gstno:req.body.gstno,
               panno:req.body.panno,
               address:req.body.address,
               pincode:req.body.pincode,
               city:req.body.city,
               state:req.body.state,
               telephoneno:req.body.telephoneno,
               mobile:req.body.mobile,
               email:req.body.email,
               bankname:req.body.bankname,
               branchname:req.body.branchname,
               accountholdername:req.body.accountholdername,
               accountnumber:req.body.accountnumber,
               ifsccode:req.body.ifsccode,
               billcode:req.body.billcode,
               creditdays:req.body.creditdays,
               createdby:'1',
               createddate:(new Date()).toString("yyyy-MM-dd HH:MM:ss"),
               isdeleted:0,
               companyweblogo:req.files[0]==undefined?"/appfiles/CompanyImages/default.png":"/appfiles/CompanyImages/"+req.files[0].originalname,
               companymobilelogo:req.files[1]==undefined?"/appfiles/CompanyImages/default.png":"/appfiles/CompanyImages/"+req.files[1].originalname,
               companyreportlogo:req.files[2]==undefined?"/appfiles/CompanyImages/default.png":"/appfiles/CompanyImages/"+req.files[2].originalname,
         })
         .then((data1)=>{
         console.log(data1._id)
          ModelBranch.create({
             companyname:req.body.companyname,
             gstno:req.body.gstno,
             panno:req.body.panno,
             address:req.body.address,
             pincode:req.body.pincode,
             city:req.body.city,
             state:req.body.state,
             telephoneno:req.body.telephoneno,
             mobile:req.body.mobile,
             email:req.body.email,
             bankname:req.body.bankname,
             branchname:req.body.branchname,
             accountholdername:req.body.accountholdername,
             accountnumber:req.body.accountnumber,
             ifsccode:req.body.ifsccode,
             billcode:req.body.billcode,
             createdby:'1',
             createddate:(new Date()).toString("yyyy-MM-dd"),
             isdeleted:'0',
             type:type,
             creditdays:req.body.creditdays,
             companyid:data1._id,
             companyweblogo:req.files[0]==undefined?"/appfiles/CompanyImages/default.png":"/appfiles/CompanyImages/"+req.files[0].originalname,
             companymobilelogo:req.files[1]==undefined?"/appfiles/CompanyImages/default.png":"/appfiles/CompanyImages/"+req.files[1].originalname,
             companyreportlogo:req.files[2]==undefined?"/appfiles/CompanyImages/default.png":"/appfiles/CompanyImages/"+req.files[2].originalname,
        })
        
           res.status(200).send({status:'success',message:'record added successfully',data1})
         })

         })
      .catch((error)=>res.status(400).send({status:'Error', message : error}))
     }
     catch(ex)
     {
       res.status(400).send(ex)
     }
        
    
  })
  router.get('/companylist',function(req,res){
    
    MasterCompany.find(
          {"isdeleted":0},
          {"_id":1,"companyname":1,"mobile":1,"gstno":1,"panno":1}
                     )
                     .then((data)=>{res.status(200).send({data:data});})
                     .catch((error)=>res.status(400).send(error));
  })
   router.get('/companyedit/:id',function(req,res){
   
       MasterCompany.find({_id:req.params.id})
      .then((data) => {
       if (!data) {
             return res.status(404).send({
            message: 'Data is Not Found',
             });
             }
          return res.status(200).send(data);
            })
           .catch((error) => res.status(400).send(error));
    })
     var count=0;
     function Imagedetails(filevalue,val,file)
     {
     
      var path = '/appfiles/CompanyImages/';
      
      if(filevalue=='nofile')
      {
       return val;
      }
      else
      {
        var filedata = path + file[count].filename;
        count = count + 1;
        console.log(filedata);
        return filedata;
      }
     
     }
  router.post('/companyupdate',uploading.any(),function(req,res){
      
      MasterCompany.findById(req.body._id)
      .then(data=>{
            if (!data) {
              return res.status(400).send({
              message: 'Company Not Found',
              });
          }
          data.updateOne({
                  companyname:req.body.companyname,
                  gstno:req.body.gstno,
                  panno:req.body.panno,
                  address:req.body.address,
                  pincode:req.body.pincode,
                  city:req.body.city,
                  state:req.body.state,
                  telephoneno:req.body.telephoneno,
                  mobile:req.body.mobile,
                  email:req.body.email,
                  bankname:req.body.bankname,
                  branchname:req.body.branchname,
                  accountholdername:req.body.accountholdername,
                  accountnumber:req.body.accountnumber,
                  ifsccode:req.body.ifsccode,
                  billcode:req.body.billcode,
                  creditdays:req.body.creditdays,
                  companyweblogo:Imagedetails(req.body.file1,data.companyweblogo,req.files),
                  companymobilelogo:Imagedetails(req.body.file2,data.companymobilelogo,req.files),
                  companyreportlogo:Imagedetails(req.body.file3,data.companyreportlogo,req.files),
                  updatedby:1,
                  updateddate:(new Date()).toString("yyyy-MM-dd"),
         })
         .then((data1) => {
          ModelBranch.findOne({companyid:req.body._id,isdeleted:0})
          .then((data3)=>{
            data3.updateOne({
              companyname:req.body.companyname,
              gstno:req.body.gstno,
              panno:req.body.panno,
              address:req.body.address,
              pincode:req.body.pincode,
              city:req.body.city,
              state:req.body.state,
              telephoneno:req.body.telephoneno,
              mobile:req.body.mobile,
              email:req.body.email,
              bankname:req.body.bankname,
              branchname:req.body.branchname,
              accountholdername:req.body.accountholdername,
              accountnumber:req.body.accountnumber,
              ifsccode:req.body.ifsccode,
              billcode:req.body.billcode,
              creditdays:req.body.creditdays,
              companyweblogo:Imagedetails(req.body.file1,data.companyweblogo,req.files),
              companymobilelogo:Imagedetails(req.body.file2,data.companymobilelogo,req.files),
              companyreportlogo:Imagedetails(req.body.file3,data.companyreportlogo,req.files),
              updatedby:1,
              updateddate:(new Date()).toString("yyyy-MM-dd"),
            })
            .then((data5)=>{
              res.status(200).send({status:'success', message : 'Record Update SuccessFully',data1})
            })
            .catch((error) => res.status(400).send(error));
          })
          })
         .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
         
    })
   router.post('/companydelete/:id',function(req,res){
        MasterCompany.findById(req.params.id)
        .then(data=>{
              if (!data) {
                return res.status(404).send({
                message: 'Data Not Found',
                });
            }
           return data.updateOne({
            isdeleted:1
           })
           .then((data1) =>{ 
            ModelBranch.findOne({companyid:new mongoose.Types.ObjectId(req.params.id),isdeleted:0})
            .then((data2)=>{
              console.log(data2)
              if (!data2) {
                return res.status(404).send({
                message: 'Data Not Found',
                });
              }
                data2.updateOne({
                  isdeleted:1
              }).then((data3)=>{

                res.status(200).send({status:'success', message : 'Record deleted SuccessFully',data1})})
              })
              .catch((error) => res.status(400).send(error));
            
            })
           .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error));
    
   })
 

module.exports = router;

