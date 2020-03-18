
global.winston = require('winston')
require("datejs");
global.logconfig ={
        'transports':[
            new winston.transports.File({
                filename:`./logs/${(new Date()).toString("yyyy-MM-dd")}.log`,
            })
        ]
    }
global.logger = winston.createLogger(logconfig);