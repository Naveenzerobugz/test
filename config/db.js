const mongoose = require('mongoose');
//mongodb://localhost:27017/zims
mongoose.connect('mongodb://208.109.8.9:27017/zims', { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
}, 
(err) => {
    if (!err) { 
        console.log('MongoDB Connection Succeeded.')
     }
    else { 
        console.log('Error in DB connection : ' + err)
     }
});

require('../models/SalesEntryModels');
require('../models/MasterCompany');
require('../models/Adminpanel/usercreationModels');
require('../models/Adminpanel/roleModels');
require('../models/Adminpanel/branchModels');
require('../models/Adminpanel/demo1Models');
require('../models/Adminpanel/demo2Models');


//--Master Models ---//
require('../models/Master/bankmodels');
require('../models/Master/taxmodels');
require('../models/Master/departmentmodels');
require('../models/Master/employeemodels');
require('../models/Master/Categorymodel');
require('../models/Master/subcategory');

require('../models/Master/expansemastermodels');
require('../models/Master/expensemodels');

require('../models/Master/customermodels');
require('../models/Master/suppliermodels');


//--product Model---//
require('../models/Master/attributemodels');
require('../models/Master/productmodels');
require('../models/Master/unitmodel');

//Purchase Screen
require('../models/Purchase/purchasemodels');
require('../models/Purchase/purchaseretunmodels');


//common
require('../models/indexmodel');