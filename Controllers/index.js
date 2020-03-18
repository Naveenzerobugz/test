const MasterCompany = require('./Master/CompanyController');
const Sales = require('./Master/demo');
const usercreation = require('./Adminpanel/usercreationController');
const Role = require('./Adminpanel/roleController');
// const Company=require('./Adminpanel/CompanyController');
const Branch=require('./Adminpanel/Branchcontroller');
//Master Controler
const Bank=require('./Master/BankController');


const Tax=require('./Master/TaxController');
const Department=require('./Master/DepartmentController');
const Employee=require('./Master/EmployeeController');

const category=require('./Master/CategoryController');
const subcategory=require('./Master/subcategorycontroller');


const Category=require('./Master/CategoryController');
const custsub=require('./Master/custsubController');
const Product=require('./Master/productController');
const expanse=require('./Master/expanseController');

const expansemain=require('./Master/expensemaincontroller');

const Attribute=require('./Master/AttributeController');
const unit=require('./Master/unitController');


const purchase=require('./Purchase/PurchaseController');
const Salescontroller=require('./sales/SalesController');
const Salesreturncontroller=require('./sales/SalesreturnController');
const purchasereturn=require('./Purchase/PurchaseReturnController');
const balancepayment=require('./Payment/balancepayment');
const receiptpayment=require('./Payment/receiptpayment');

const Excelreport=require('./Excelreport/ExcelreportController');


module.exports = {
    // Company,
    MasterCompany,
    usercreation,
    Role,
    Branch,
    Sales,
    Bank,
    Tax,
    Department,
    Employee,
    category,
    subcategory,
    Category,
    custsub,    
    Product,
    custsub,
    Attribute,
    expanse,
    expansemain, 
    unit ,
    purchase,
    Salescontroller ,
    purchasereturn  ,
    Salesreturncontroller,
    balancepayment,
    Excelreport,
    receiptpayment,
}