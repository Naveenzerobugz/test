const salesmodel= require('./Sales/salesmodels');
const SaleReturn= require('./Sales/salereturnmodels');
const BalancePayment= require('./payment/balancepayment');
const ReceiptPayment=require('./Payment/receiptpayment');
const Payment=require('./Payment/payment');


module.exports={
    salesmodel,
    SaleReturn,
    BalancePayment,
    ReceiptPayment,
    Payment
    
}