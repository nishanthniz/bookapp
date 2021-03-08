var mongoose = require('mongoose');

function fn_GetDBConn() {
    return new Promise((resolve, reject) => {
        const dbUrl = "mongodb+srv://nishanth:Gc7mYbYsXWBJe6ap@cluster0.xfw5n.mongodb.net/booksDB?retryWrites=true&w=majority";
        mongoose.connect(dbUrl, function(dbError, dbConnRes){
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