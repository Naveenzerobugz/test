var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
const bodyParser = require('body-parser');
const common = require('./commonjsonfiles/commondatas');
const loggerfiles = require('./config/logger');
global.mongoose = require('mongoose');
global.db= require('./config/db');
global.url = require('url');
global.date=require("datejs");

var indexRouter = require('./routes/index');
var CompanyRouter = require('./routes/company');
var testRouter = require('./routes/test');
var AdminLoginRouter = require('./routes/adminlogin');
var masterrouter = require('./routes/masters');
var purchaseRouter=require('./routes/purchase');
var salesRouter=require('./routes/Sales');
var reportRouter=require('./routes/reportrouter');

// create express app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//session mamagement
app.use(session({
    secret: 'iloveit',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 * 2 },
   
  }));
  
app.use('/', reportRouter); 
app.use('/', indexRouter); 
app.use('/', purchaseRouter); 
app.use('/', salesRouter); 
app.use('/master', masterrouter); 
app.use('/Adminpanel',CompanyRouter);
app.use('/test',testRouter);
app.use('/adminlogin',AdminLoginRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  });




// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

module.exports = app;