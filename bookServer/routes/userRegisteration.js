const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const {
    v5: uuidV5
} = require('uuid');
const mongoInstance = require('../instances/mongoinstance');

let objResponse = {
    "status": "FAILURE",
    "data": [],
    "message": ""
};
let mDBConn = "";
router.post('/', (req, res) => {
    try {
        let params = (req.body) ? req.body.data : {};
        getDBConfig().then((dbConn) => {
            mDBConn = dbConn;
        }).catch((cErr) => {
            objResponse.message = cErr;
            sendResponseToClient(res, objResponse, null);
        });
    } catch (error) {
        objResponse.message = error;
        sendResponseToClient(res, objResponse, null);
    }
});

function getDBConfig() {
    return new Promise((resolve, reject) => {
        try {
            mongoInstance.GetDBConn().then((dbConn) => {
                resolve(dbConn);
            }).catch((connErr) => {
                rejects(connErr);
            })
        } catch (error) {
            reject(error);
        }
    });
}

function sendResponseToClient(res, errorRes, successRes) {
    try {
        if (errorRes) {
            res.send(errorRes);
        } else {
            res.send(successRes);
        }
    } catch (error) {
        res.send(error);
    }
}

module.exports = router;