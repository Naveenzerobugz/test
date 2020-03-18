var express = require('express');
var router = express();
var multer  =   require('multer'); 

var custsub = require('../Controllers').custsub;
var expanse = require('../Controllers').expanse;
var expansemain = require('../Controllers').expansemain;

var expensestorage =   multer.diskStorage({  
    destination: function (req, file, callback) {  
      callback(null, './public/appfiles/expensefiles/');  
    },  
    filename: function (req, file, callback) { 
      
      callback(null,file.originalname);  
    }  
  }); 
  var expanseuploading = multer({ storage : expensestorage});

router.get('/state', function (req, res) {
    var data = state;
    return res.status(200).send(data)
})
router.get('/paymentterms', function (req, res) {
    var data = paymentterms;
    return res.status(200).send(data)
})
router.get('/customertype', function (req, res) {
    var data = customertype;
    return res.status(200).send(data)
})
router.get('/gsttype', function (req, res) {
    var data = gsttype;
    return res.status(200).send(data)
})

router.post('/custsup', custsub.insertupdate)
router.post('/custsuplist', custsub.list)
router.get('/custlist/:id', custsub.custgetlist)
router.get('/suplist/:id', custsub.supgetlist)
router.post('/custsubdelete/', custsub.delete)
router.get('/supplierdopdown/', custsub.supplierdropdownlist)
router.get('/customerdopdown/', custsub.customerdropdownlist)
router.get('/test', custsub.test)
router.post('/customerinsert', custsub.insercustomer)

router.post('/expanse', expanse.insertupdate)
router.post('/expanselist', expanse.list)
router.get('/expanse/:id', expanse.getlist)
router.get('/expanseddl', expanse.dropdownlist)
router.post('/expansedelete/:id', expanse.delete)

router.post('/expensemain',expanseuploading.any() ,expansemain.insertupdate)
router.post('/expensemainlist',expansemain.list)
router.get('/expensemain/:id',expansemain.getlist)
router.post('/expensemain/:id',expansemain.delete)
router.post('/testexpanse',expansemain.list2)

router.post('/testt', function (req, res) {
    var data = [
    { "salesmanname": "vicky", "userid": "100", "username": "vicky", "password": "1" },
    { "salesmanname": "vignesh", "userid": "101", "username": "vignesh", "password": "2" },
    { "salesmanname": "naren", "userid": "102", "username": "naren", "password": "3" },
    { "salesmanname": "jai", "userid": "103", "username": "jai", "password": "4" },
    { "salesmanname": "naveen", "userid": "104", "username": "naveen", "password": "5" },
    { "salesmanname": "boopathy", "userid": "105", "username": "boopathy", "password": "6" }
]

// console.log(JSON.parse(data))
res.send(data)
})
module.exports = router;