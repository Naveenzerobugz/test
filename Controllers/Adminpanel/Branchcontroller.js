var mongoose = require('mongoose');
const Branch = mongoose.model('Branch');
const MasterCompany = mongoose.model('MasterCompany');
require("datejs");
var count = 0;
module.exports = {

  insert(req, res) {
    try {

      Branch.create({
        companyname: req.body.companyname,
        gstno: req.body.gstno,
        panno: req.body.panno,
        address: req.body.address,
        pincode: req.body.pincode,
        city: req.body.city,
        state: req.body.state,
        telephoneno: req.body.telephoneno,
        mobile: req.body.mobile,
        email: req.body.email,
        bankname: req.body.bankname,
        branchname: req.body.branchname,
        accountholdername: req.body.accountholdername,
        accountnumber: req.body.accountnumber,
        ifsccode: req.body.ifsccode,
        billcode: req.body.billcode,
        createdby: '1',
        createddate: (new Date()).toString("yyyy-MM-dd"),
        isdeleted: '0',
        type: 'sub',
        creditdays: req.body.creditdays,
        companyid: req.session.companyid,
        companyweblogo: req.files[0] == undefined ? "/appfiles/CompanyImages/default.png" : "/appfiles/CompanyImages/" + req.files[0].originalname,
        companymobilelogo: req.files[1] == undefined ? "/appfiles/CompanyImages/default.png" : "/appfiles/CompanyImages/" + req.files[1].originalname,
        companyreportlogo: req.files[2] == undefined ? "/appfiles/CompanyImages/default.png" : "/appfiles/CompanyImages/" + req.files[2].originalname,
      })
        .then((data) => {
          res.status(200).send({
            status: 'success',
            message: 'record added successfully'
          })
        })
        .catch((error) => res.status(400).send({
          status: 'Error',
          message: error
        }))

    }
    catch (error) {
      res.status(400).send(error);
    }
  },
  list(req, res) {
    Branch.find(
      { "isdeleted": 0 },
      { "_id": 1, "companyname": 1, "mobile": 1, "gstno": 1, "panno": 1, "type": 1 },

    )
      .then((data) => { res.status(200).send({ data: data }); })
      .catch((error) => res.status(400).send(error));
  },
  edit(req, res) {
    Branch.find({ _id: req.params.id })
      .then((data) => {
        if (!data) {
          return res.status(404).send({
            message: 'Data is Not Found',
          });
        }
        return res.status(200).send(data);
      })
      .catch((error) => res.status(400).send(error));
  },
  update(req, res) {
    try {
      Branch.findById(req.body._id)
        .then(data => {

          if (!data) {
            return res.status(400).send({
              message: 'Branch Not Found',
            });
          }
          data.updateOne({
            companyname: req.body.companyname,
            gstno: req.body.gstno,
            panno: req.body.panno,
            address: req.body.address,
            pincode: req.body.pincode,
            city: req.body.city,
            state: req.body.state,
            telephoneno: req.body.telephoneno,
            mobile: req.body.mobile,
            email: req.body.email,
            bankname: req.body.bankname,
            branchname: req.body.branchname,
            accountholdername: req.body.accountholdername,
            accountnumber: req.body.accountnumber,
            ifsccode: req.body.ifsccode,
            billcode: req.body.billcode,
            companyweblogo: Imagedetails(req.body.file1, data.companyweblogo, req.files),
            companymobilelogo: Imagedetails(req.body.file2, data.companymobilelogo, req.files),
            companyreportlogo: Imagedetails(req.body.file3, data.companyreportlogo, req.files),
            updatedby: 1,
            updateddate: (new Date()).toString("yyyy-MM-dd"),
            companyid: req.session.companyid,
          })
            .then((data1) => {

              res.status(200).send({
                status: 'success',
                message: 'record updated successfully'
              })
            })

        })
        .catch((error) => res.status(400).send(error));
    }
    catch (error) {
      return res.status(400).send(error);
    }
  },
  softdelete(req, res) {
    console.log(req.params.id)
    Branch.findById(req.params.id)
      .then(data => {
        if (!data) {
          return res.status(400).send({
            message: 'Branch Not Found',
          });
        }
        data.updateOne({
          isdeleted: 1
        })
          .then((data1) => {

            res.status(200).send({ status: 'success', message: 'Record Update SuccessFully', data3 })

          })
          .catch((error) => res.status(400).send(error));
      })

  }
}
function Imagedetails(filevalue, val, file) {

  var path = '/appfiles/CompanyImages/';

  if (filevalue == 'nofile') {
    return val;
  }
  else {
    var filedata = path + file[count].filename;
    count = count + 1;
    return filedata;
  }

}