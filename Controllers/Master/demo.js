var mongoose = require('mongoose');
const SalesEntry = mongoose.model('SalesEntry');

module.exports = {
    insert(req, res) {
        SalesEntry.create({
            Entrydate: '20-12-2020',
            description: '10',
            customername: 'Jeevith',
            saledetail: [{ "productname": 'mobile', "rate": '5000', "qty": '10' }, { "productname": 'watch', "rate": '50', "qty": '10' }]
        })
            .then((data) => { res.status(200).send({ status: 'success', message: 'record added successfully', data }) })
            .catch((error) => res.status(400).send(error))
    },
    list(req, res) {

        SalesEntry.find(
            { customername: "Jeevith" },
             { 
                 Entrydate: 1,
                description: 1,
                customername: 1,
                "saledetail.qty": 1,
                total: { $sum: "$saledetail.qty" } 
             }
            )
            .then((data) => res.status(200).send(data))
            .catch((error) => res.status(400).send(error))
    },
    sumofamount(req, res) {
        SalesEntry.aggregate([
            { "$unwind": "$saledetail" },
            { "$match": { "customername": "Jeevith" } },
            {
                "$group": {
                    _id: {
                        customername: "$customername",
                        description: "$description"
                    },
                    totalqty: { "$sum": "$saledetail.qty" },

                }
            },

        ])
            .then((data) => res.status(200).send(data))
            .catch((error) => res.status(400).send(error))
    }
}