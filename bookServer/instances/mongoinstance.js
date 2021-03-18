var mongoose = require('mongoose');

function fn_GetDBConn() {
    return new Promise((resolve, reject) => {
        const dbUrl = process.env.DBCONNECTIONURL;
        mongoose.connect(dbUrl, function (dbError, dbConnRes) {
            if (dbError) {
                reject(dbError);
            } else {
                if (dbConnRes != undefined) {
                    resolve(dbConnRes);
                } else {
                    reject("Unable to get DB connection");
                }
            }
        })
    })
}

module.exports = {
    GetDBConn: fn_GetDBConn
};