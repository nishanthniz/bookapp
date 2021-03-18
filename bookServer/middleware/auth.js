let jwt = require('jsonwebtoken');

let generateJWT = (userID) => {
    return jwt.sign({
        Id: userID
    }, process.env.JWT_SECRETKEY);
}

let isValidJWT = (token) => {
    jwt.verify(token, process.env.JWT_SECRETKEY, (jwtVerifyErr, jwtDecodeRes) => {
        if (jwtVerifyErr) {
            return false;
        } else {
            if (jwtDecodeRes) {
                return true;
            } else {
                return false;
            }
        }
    });
}

module.exports = {
    generateJWT,
    isValidJWT
}