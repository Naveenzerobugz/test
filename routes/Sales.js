var express = require('express');
var router = express();
var engine = require('ejs-locals');
router.engine('ejs', engine);
router.set('view engine', 'ejs');

const Salescontroller = require('../Controllers').Salescontroller;
const Salesreturncontroller = require('../Controllers').Salesreturncontroller;
const receiptpayment = require('../Controllers').receiptpayment;
router.get('/sales', function(req, res, next) {

    //   if (req.session.usrid)
    res.render('./sales/SalesEntry/index.ejs', { title: 'Sales' });
    //    else
    //    res.render('./Adminpanel/login/login', { title: 'Login' });
});

router.get('/salereturn', function(req, res, next) {

    if (req.session.usrid)
        res.render('./sales/Salesreturn/index.ejs', { title: 'Sales' });
    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/receiptentry', function(req, res, next) {

     if (req.session.usrid)
    res.render('./payment/ReceiptEntry/index.ejs');
     else
    res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/sales/invoiceno', Salescontroller.invoiceno);
router.post('/sales/insertupdate', Salescontroller.insert);
router.get('/sales/list', Salescontroller.list);
router.get('/sales/testlist/:_id', Salescontroller.testlist);
router.get('/sales/edit/:_id', Salescontroller.edit);
router.post('/sales/delete/:_id', Salescontroller.delete);
router.get('/sales/invoicenolist', Salescontroller.salesnodropdownlist);
router.post('/sales/invoicebill/:_id', Salescontroller.invoicebill);


router.get('/salesreturn/salesretrunno', Salesreturncontroller.salesretrunno);
router.post('/salesreturn/insertupdate', Salesreturncontroller.insert);
router.get('/salesreturn/list', Salesreturncontroller.list);
router.get('/sales/return/:_id', Salesreturncontroller.edit);
router.post('/sales/returndelete/:_id', Salesreturncontroller.delete);
router.get('/sales/invoiceno/:_id', Salesreturncontroller.saledetails);

router.get('/receipt/customerbalance/:id', receiptpayment.CustomerBalanceDetails);
router.get('/receipt/receiptno', receiptpayment.receiptno);
router.post('/receipt/insertupdate', receiptpayment.insert);
router.get('/receipt/list', receiptpayment.list);
router.get('/receipt/edit/:receiptno', receiptpayment.edit);
router.post('/receipt/delete/:receiptno', receiptpayment.delete);




module.exports = router;