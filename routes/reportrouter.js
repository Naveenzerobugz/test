require('../config/db');

var express = require('express');
var router = express();
var engine = require('ejs-locals');
router.engine('ejs', engine);
router.set('view engine', 'ejs');

const Excelreport = require('../Controllers').Excelreport;

router.post('/purchase/puchaseexcelreport', Excelreport.pushaselist);

router.get('/purchase/puchasereport', Excelreport.pushaselist);

router.post('/sales/salesreport', Excelreport.saleslist);

router.get('/sales/salesexcelreport', Excelreport.saleslist);

//router.get('/stock/stockreport',Excelreport.stocklist);

router.post('/stock/stockreport', Excelreport.stocklist);

router.get('/stock/stockexcelreport', Excelreport.stocklist);

router.post('/report/customeroutstandingreport', Excelreport.customeroutstanding)

//router.get('/report/supplieroutstanding',Excelreport.supplieroutstanding)
router.post('/router/supplieroutstanding', Excelreport.supplieroutstanding)

module.exports = router;