const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const mongoInstance = require('../instances/mongoinstance');

let objResponse = {
    "status": "FAILURE",
    "data": [],
    "custom_error": false,
    "message": ""
};
let mDBConn = "";
router.post('/', (req, res) => {
    try {
        let params = (req.body) ? req.body.data : {};
        fn_GetDBConfig().then((dbConn) => {
            mDBConn = dbConn;
            fn_UserLogin(params).then((loginRes) => {
                objResponse.message = loginRes;
                sendResponseToClient(res, null, objResponse);
            }).catch((loginErr) => {
                objResponse.message = loginErr;
                sendResponseToClient(res, objResponse, null);
            });
        }).catch((connErr) => {
            objResponse.message = connErr;
            sendResponseToClient(res, objResponse, null);
        });
    } catch (error) {
        objResponse.message = error;
        sendResponseToClient(res, objResponse, null);
    }
});

function fn_UserLogin(inputParams) {
    return new Promise((resolve, reject) => {
        try {
            let condObj = {
                EmailID: inputParams.EmailID,
                Status: "Active"
            };
            mDBConn.collection('users').find(condObj).toArray((fetchErr, fetchRes) => {
                if (fetchErr) {
                    reject(fetchErr);
                } else {
                    if (fetchRes.length > 0) {
                        let hashPassword = crypto.pbkdf2Sync(inputParams.Password, fetchRes[0].Salt, 1000, 16, 'sha512').toString('hex');
                        if (fetchRes[0].Password.toString() === hashPassword.toString()) {
                            objResponse.data = fetchRes;
                            objResponse.custom_error = false;
                            resolve("User logged in successfully");
                        } else {
                            objResponse.custom_error = true;
                            reject("Incorrect Password");
                        }
                    } else {
                        objResponse.custom_error = true;
                        reject("User not found");
                    }
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

function fn_GetDBConfig() {
    return new Promise((resolve, reject) => {
        try {
            mongoInstance.GetDBConn().then((dbConn) => {
                resolve(dbConn);
            }).catch((connErr) => {
                reject(connErr);
            })
        } catch (error) {
            reject(error);
        }
    });
}

function sendResponseToClient(res, errorRes, successRes) {
    try {
        if (errorRes) {
            errorRes.status = "FAILURE";
            res.send(errorRes);
        } else {
            successRes.status = "SUCCESS";
            res.send(successRes);
        }
    } catch (error) {
        res.send(error);
    }
}

module.exports = router;