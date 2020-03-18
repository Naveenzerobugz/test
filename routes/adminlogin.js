require('../config/db');

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');


const UserCreation = mongoose.model('UserCreation');
const MasterCompany = mongoose.model('MasterCompany');




router.post('/login', function (req, res) {
    try {
      console.log(req.body.uname)
             MasterCompany.findOne(
                { "isdeleted": 0,"companyname":req.body.company }
                 )
              .then((data)=>{
                 
                  if(!data)
                  {
                      return res.status(400).send("Company name is Mismatch")
                  }
              
                 //console.log(req.body.pass)
                  UserCreation.findOne(
                    { companyid :data._id, username:{ "$regex" : req.body.uname , "$options" : "i"} , password:req.body.pass }
                    // {
                    //     "companyid": 1,"branchid":1,"roleid":1,"name":1,"_id":1,"profilepic":1,
                    // }
               )
                .then((data1) => {
                    console.log('-----------------------SESSION START------------------')
                //    console.log(data1);
                    if(!data1)
                    {
                        return res.status(400).send('Login Credentials Failed');
                    }
                    req.session.companyid = data1.companyid;
                    req.session.roleid = data1.roleid;
                    req.session.usrid = data1._id;  
                    req.session.branchid=data1.branchid;
                    
                    console.log(req.session.branchid)

                     res.status(200).send({
                        status: 'success',
                        message: 'valid user',
                        url: '/dashboard',
                        data1
                    })
                    console.log('companyid in session  :'+ req.session.companyid)
                    console.log('roleid in session  :'+ req.session.roleid)
                })
                .catch((error) => {res.status(400).send(error)});
              })   
          
    } catch (e) {
       
        return res.status(400).send(e)
    }
});
router.post('/sessionverify',function(req,res){
    console.log('companyid in session  :'+ req.session.companyid)
    console.log('roleid in session  :'+ req.session.roleid)
   
    res.status(200).send(req.session); 
})
router.post('/setsession',function(req,res){
    req.session.companyid=55225;  
    res.send(200); 
})
router.get('/signout',function(req,res){
    console.log('one')
    req.session.companyid = '';
    req.session.roleid = '';
    req.session.usrid = '';
    req.session.branchid='';
    res.redirect('/'); 
})

module.exports = router;