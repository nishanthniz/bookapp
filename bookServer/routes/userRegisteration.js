const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const {
    v4: uuidv4
} = require('uuid');
const mongoInstance = require('../instances/mongoinstance');
const auth = require('../middleware/auth');

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
            if (params.process === "validate_UserName" || params.process === "validate_EmailID") {
                fn_ValidateUser(params).then((vldRes) => {
                    objResponse.data = vldRes;
                    sendResponseToClient(res, null, objResponse);
                }).catch((vldErr) => {
                    objResponse.message = vldErr;
                    sendResponseToClient(res, objResponse, null);
                });
            } else {
                fn_ExecuteUserProcess(params).then((processRes) => {
                    objResponse.message = processRes;
                    sendResponseToClient(res, null, objResponse);
                }).catch((processErr) => {
                    objResponse.message = processErr;
                    sendResponseToClient(res, objResponse, null);
                });
            }
        }).catch((connErr) => {
            objResponse.message = connErr;
            sendResponseToClient(res, objResponse, null);
        });
    } catch (error) {
        objResponse.message = error;
        sendResponseToClient(res, objResponse, null);
    }
});

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

function fn_ValidateUser(inputParams) {
    return new Promise((resolve, reject) => {
        try {
            let condObj = {};
            if (inputParams.process === "validate_UserName") {
                condObj.UserName = inputParams.UserName;
            } else if (inputParams.process === "validate_EmailID") {
                condObj.EmailID = inputParams.EmailID;
            } else {
                reject("Please mention the validation control");
            }
            mDBConn.collection('users').find(condObj).toArray((vldErr, vldRes) => {
                if (vldErr) {
                    reject(vldErr);
                } else {
                    resolve(vldRes);
                }
            });
        } catch (error) {
            reject(error);
        }
    })
}

function fn_ExecuteUserProcess(inputParams) {
    return new Promise((resolve, reject) => {
        try {
            if (inputParams.process === "create_user") {
                let salt = crypto.randomBytes(12).toString('hex');
                let hashPassword = crypto.pbkdf2Sync(inputParams.PasswordGroup.Password, salt, 1000, 16, 'sha512').toString('hex');
                let newUser = {};
                newUser.Id = uuidv4();
                newUser.UserName = inputParams.UserName;
                newUser.EmailID = inputParams.EmailID;
                newUser.Password = hashPassword;
                newUser.Salt = salt;
                newUser.CreatedDate = new Date();
                newUser.ModifiedDate = new Date();
                newUser.Status = "Active";
                mDBConn.collection('users').insertOne(newUser, (insErr, insRes) => {
                    try {
                        if (insErr) {
                            reject(insErr);
                        } else {
                            let jwtToken = auth.generateJWT(newUser.Id);
                            objResponse.jwtToken = jwtToken;
                            resolve("User has been registered successfully!");
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
            }

        } catch (error) {
            reject(error);
        }
    })
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