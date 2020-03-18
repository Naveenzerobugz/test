const mongoose = require('mongoose');
var Role = mongoose.model('Role');
require("datejs");
module.exports = {
    insert(req, res) {
        console.log(req.body.rolename);
        Role.create({
            rolename: req.body.rolename,
            description: req.body.description,
            companyid: '1',
            createdby: '1',
            createddate: (new Date()).toString("yyyy-MM-dd"),
            isdeleted: '0'
        }).then((data) => {
            res.status(200).send({
                status: 'success',
                message: 'record added successfully'
            })
        })
            .catch((error) => {
                res.status(400).send({
                    status: 'Error',
                    message: error
                })
            }
            )
    },
    list(req, res) {
        Role.find(
            { "isdeleted": 0 },
            { "_id": 1, "rolename": 1, "description": 1 }
        )
            .then((data) => { res.status(200).send({ data: data }); })
            .catch((error) => res.status(400).send(error));
    },
    dropdownlist(req, res) {
        Role.aggregate([
            {
                $match: { "isdeleted": 0 }
            },
            {
                $project: {
                    id: '$_id',
                    name: "$rolename"
                }
            }
        ])
            .then((data) => { res.status(200).send({ data: data }); })
            .catch((error) => res.status(400).send(error));
    },
    edit(req, res) {
        Role.find({ _id: req.params.id })
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

        Role.findById(req.params.id)
            .then((data) => {

                if (!data) {
                    return res.status(400).send({
                        message: 'RoleName Not Found',
                    });
                }
                return data.updateOne({
                    rolename: req.body.rolename,
                    description: req.body.description,
                    updatedby: '1',
                    updateddate: (new Date()).toString("yyyy-MM-dd"),
                })
                    .then((data) => res.status(200).send({
                        status: 'success',
                        messgae: 'record added successfully'
                    }))
                    .catch((error) => res.status(400).send({
                        status: 'Error',
                        message: error
                    }))
            })
            .catch((error) => res.status(400).send(error));
    },
    softdelete(req, res) {

        Role.findById(req.params.id)
            .then((data) => {
                if (!data) {
                    return res.status(400).send({
                        message: 'RoleDetails Not Found',
                    });
                }
                data.updateOne({
                    isdeleted: 1
                })
                    .then((data) => res.status(200).send({
                        status: 'success',
                        message: 'Record Deleted successfully'
                    }))
                    .catch((error) => res.status(400).send({
                        status: 'Error',
                        message: error
                    }))
            })
            .catch((error) => res.status(400).send(error));

    }
}