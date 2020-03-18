require('../config/db');

var express = require('express');
var router = express();
var engine = require('ejs-locals');
router.engine('ejs', engine);
router.set('view engine', 'ejs');
var Purchase = mongoose.model('Purchase');

router.get('/excel',function(req,res,next){
    res.render('./excelreport/index.ejs', { title: 'excel' });
})
router.get('/stockreport',function(req,res,next){
    res.render('./report/stock', { title: 'stockreport' });
})
router.get('/purchasereport',function(req,res,next){
    res.render('./report/product', { title: 'purchasereport' });
})

router.get('/customeroutstanding',function(req,res,next){
    res.render('./report/customeroutstanding', { title: 'customeroutstanding' });
})

router.get('/supplieroutstanding',function(req,res,next){
    res.render('./report/supplioeroutstanding', { title: 'supplieroutstanding' });
})

router.get('/salesreport',function(req,res,next){
    res.render('./report/sales', { title: 'salesreport' });
})

router.get('/', function (req, res, next) {
    res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/dashboard', function (req, res, next) {
    if (req.session.usrid)
        res.render('./Dashboard/index', { title: 'Login' });
    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/custsup', function (req, res, next) {
    if (req.session.usrid)
        res.render('./Master/cds/index', { title: 'Customer|supllier|dealer' });
    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/expense', function (req, res, next) {
    if (req.session.usrid)
        res.render('./Master/expanse/index.ejs', { title: 'expense' });
    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/expanseentry', function (req, res, next) {
       if (req.session.usrid)
        res.render('./Master/expansemain/index.ejs', { title: 'expanse' });
       else
           res.render('./Adminpanel/login/login', { title: 'Login' });
});
//master bank router
router.get('/bank', function (req, res, next) {
    if (req.session.usrid)
        res.render('./Master/bank/index.ejs', { title: 'bank' });
    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
//masrer tax router
router.get('/tax', function (req, res, next) {
    if (req.session.usrid)
        res.render('./Master/tax/index.ejs', { title: 'tax' });
    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});

// master dept router
router.get('/department', function (req, res, next) {
    if (req.session.usrid)
        res.render('./Master/department/index.ejs', { title: 'department' });
    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});

// master employee router
router.get('/employee', function (req, res, next) {
    if (req.session.usrid)
        res.render('./Master/employee/index.ejs', { title: 'employee' });
    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
// master Product router

router.get('/product',function(req,res,next){
    if(req.session.usrid)
    res.render('./Master/Product/index.ejs', { title: 'employee' });
    else
    res.render('./Adminpanel/login/login', { title: 'Login' }); 


});
// master Category router
router.get('/category', function (req, res, next) {
    res.render('./Master/Category/index.ejs', { title: 'Category' });
});
// master subcategory router
router.get('/subcategory', function (req, res, next) {
    res.render('./Master/subcategory/index.ejs', { title: 'subcategory' });
});




router.get('/sample',function(req,res){
    console.log('sample')
    res.render('./Purchase/PurchaseReturn/index.ejs', { title: 'PurchaseEntry' });
     // logger.info('hai hello')
      
 })






// master unit router
router.get('/unit', function (req, res, next) {
    res.render('./Master/unit/index.ejs', { title: 'unit' });
});
router.get('/test', function (req, res, next) {
    res.render('./Master/test/index.ejs', { title: 'unit' });
});
const MasterCompany = require('../Controllers').MasterCompany;
const Sales = require('../Controllers').Sales;
const Bank = require('../Controllers').Bank;


const Tax = require('../Controllers').Tax;
const Department = require('../Controllers').Department;
const Employee = require('../Controllers').Employee;




// const category=require('../Controllers').category;
 //const subcategory=require('../Controllers').subcategory;
const Product=require('../Controllers').Product;

const Attribute=require('../Controllers').Attribute;
const subcategory = require('../Controllers').subcategory;
const unit=require('../Controllers').unit;

//master Attribute
 router.post('/master/attributeinsert',Attribute.insert);
 router.get('/master/attributelist',Attribute.list);
 router.get('/master/attributeedit/:_id',Attribute.edit);
 router.post('/master/attributedelete/:_id',Attribute.deleterecord);



// master catrgory



//master bank
router.post('/master/bankinstert',Bank.insert);
router.get('/master/banklist',Bank.list);
router.get('/master/banklistddl',Bank.ddllist);
router.get('/master/bankedit/:_id',Bank.edit);
router.post('/master/bankdelete/:_id',Bank.deleterecord);

//master tax
router.post('/master/taxinstert',Tax.insert);
router.get('/master/taxlist',Tax.list);
router.get('/master/taxedit/:_id',Tax.edit);
router.post('/master/taxdelete/:_id',Tax.deleterecord);
router.get('/master/taxdropdown',Tax.dropdownlist);

//master department
router.post('/master/deptinstert',Department.insert);
router.get('/master/deptlist',Department.list);
router.get('/master/deptedit/:_id',Department.edit);
router.post('/master/deptdelete/:_id',Department.deleterecord);
router.get('/master/deptdropdown',Department.dropdown);

//master employee
router.post('/master/empinstert',Employee.insert);
router.get('/master/emplist',Employee.list);
router.get('/master/empedit/:_id',Employee.getedit);
router.post('/master/empdelete/:_id',Employee.deleterecord);




//master subcategory
router.post('/master/subcategoryinsert', subcategory.insert);
router.get('/master/subcategorylist', subcategory.list);
router.get('/master/subcategoryedit/:_id', subcategory.edit);
router.post('/master/subcategorydelete/:_id', subcategory.deleterecord);
 router.get('/master/subcategoryddllist/:categoryid', subcategory.dropdown);

const category = require('../Controllers').Category;
// master catrgory
router.post('/master/categoryinsert',category.insert);
router.get('/master/categorylist',category.list);
router.get('/master/categoryedit/:_id',category.edit);
router.post('/master/categorydelete/:_id',category.deleterecord);
router.get('/master/categoryddllist',category.dropdownlist);

// master unit
router.post('/master/unitinsert', unit.insert);
router.get('/master/unitlist', unit.list);
router.get('/master/unitedit/:_id', unit.edit);
router.post('/master/unitdelete/:_id', unit.deleterecord);
router.get('/master/unitdropdown/', unit.dropdown);



router.post('/master/bankinstert', Bank.insert);
router.get('/master/banklist', Bank.list);
router.get('/master/bankedit/:_id', Bank.edit);
router.post('/master/bankdelete/:_id', Bank.deleterecord);


router.post('/master/taxinstert', Tax.insert);
router.get('/master/taxlist', Tax.list);
router.get('/master/taxedit/:_id', Tax.edit);
router.post('/master/taxdelete/:_id', Tax.deleterecord);
router.get('/master/taxdropdown', Tax.dropdownlist);


router.post('/master/deptinstert', Department.insert);
router.get('/master/deptlist', Department.list);
router.get('/master/deptedit/:_id', Department.edit);
router.post('/master/deptdelete/:_id', Department.deleterecord);
router.get('/master/deptdropdown', Department.dropdown);

router.post('/master/empinstert', Employee.insert);
router.get('/master/emplist', Employee.list);
router.get('/master/empedit/:_id', Employee.getedit);
router.post('/master/empdelete/:_id', Employee.deleterecord);
router.get('/master/employeeddl/', Employee.employeeddllist);


//master product
router.post('/master/productinstert',Product.insert);
router.get('/master/produtlist',Product.list);
router.get('/master/productedit/:_id',Product.edit);
router.post('/master/productdelete/:_id',Product.deleterecord);
router.get('/master/productdropdown',Product.dropdownlist);
router.get('/master/productdetails/:_id',Product.productdetailswithattributes);
router.get('/master/productsdetail',Product.productdetails)


router.post('/api/sales', Sales.insert);
router.get('/api/saleslist', Sales.list);
router.get('/api/salesamount', Sales.sumofamount);


router.post('/api/company', MasterCompany.add);
router.get('/api/list', MasterCompany.list);
router.post('/api/update/:id', MasterCompany.update);

router.get('/test', function (req, res, next) {
    res.render('./templates/home', { title: 'Login' });
});
router.get('/usercreation', function (req, res, next) {
    if (req.session.usrid)
        res.render('./Adminpanel/Usercreation/index', { title: 'Usercreation' });
    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/role', function (req, res, next) {
    if (req.session.usrid)
        res.render('./Adminpanel/Role/index', { title: 'role' });
    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/company', function (req, res, next) {
    // if (req.session.usrid)
        res.render('./company/index', { title: 'role' });
    // else
    //     res.render('./Adminpanel/login/login', { title: 'Login' });
});
router.get('/branch', function (req, res, next) {
    if (req.session.usrid)
        res.render('./Adminpanel/Branch/index', { title: 'Branch' });
    else
        res.render('./Adminpanel/login/login', { title: 'Login' });
});

module.exports = router;