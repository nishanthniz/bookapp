let express = require('express');
let router = express.Router();
let gm = require('gm').subClass({
    imageMagick: true
});
let mongoInstance = require('../instances/mongoinstance');
let objResponse = {
    "status": "FAILURE",
    "data": [],
    "message": ""
};
router.post('/', (req, res) => {
    let params = (req.body) ? req.body.data : {};
    bookProcess(params).
    then((processRes) => sendResponseToClient(res, null, processRes)).
    catch((processErr) => sendResponseToClient(res, processErr, null));
});

function bookProcess(inputParams) {
    return new Promise((resolve, reject) => {
        mongoInstance.GetDBConn().then((dbConn) => {
            if (inputParams.process_type === "SAVE") {
                let convertedBookContent = "";
                if (inputParams.bookContent) {
                    let isBase64 = inputParams.bookContent.match(/^data:([A-Za-z-+.\/]+);base64,(.+)$/);
                    convertedBookContent = new Buffer.from(isBase64[2], 'base64');
                }
                fn_CreateThumbnail(convertedBookContent).then((bufPDFThumbnail) => {
                    let newBook = {
                        bookName: inputParams.bookName,
                        authorName: inputParams.authorName,
                        uploadedBy: inputParams.uploadedBy,
                        uploadedDate: new Date(),
                        bookContent: convertedBookContent,
                        bookThumbnail: bufPDFThumbnail,
                        status: "ACTIVE"
                    };
                    dbConn.collection('books').insertOne(newBook, (insErr, insRes) => {
                        if (insErr) {
                            reject(insErr);
                        } else {
                            objResponse.status = "SUCCESS";
                            objResponse.data = `${newBook.bookName} book has been uploaded successfully`;
                            objResponse.message = `${newBook.bookName} book has been uploaded successfully`;
                            resolve(objResponse);
                        }
                    });
                }).catch((thumbErr) => {
                    objResponse.message = thumbErr;
                    reject(objResponse);
                });
            } else if (inputParams.process_type === "UPDATE") {

            } else if (inputParams.process_type === "DELETE") {

            } else if (inputParams.process_type === "FETCH") {
                let inputCondObj = (inputParams.fetchCond) ? inputParams.fetchCond : {};
                dbConn.collection('books').find(inputCondObj).toArray((findErr, findRes) => {
                    if (findErr) {
                        objResponse.message = findErr;
                        reject(objResponse);
                    } else {
                        objResponse.status = "SUCCESS";
                        objResponse.data = findRes;
                        objResponse.message = "Book(s) has been fetched successfully";
                        resolve(findRes);
                    }
                });
            } else {
                objResponse.message = "Please mention the process_type";
                reject(objResponse);
            }
        }).catch((connErr) => {
            objResponse.message = connErr;
            reject(objResponse);
        });
    });
};

function fn_CreateThumbnail(bufferBookContent) {
    return new Promise((resolve, reject) => {
        try {
            // resolve("SUCCESS");
            gm(bufferBookContent)
                .resize(200, 200)
                .setFormat('jpeg')
                .toBuffer((gmErr, gmBufRes) => {
                    if (gmErr) {
                        reject(gmErr);
                    } else {
                        resolve(gmBufRes);
                    }
                });
        } catch (error) {
            reject(error)
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