const config = require('config');
const jwt = require('jsonwebtoken');
const token = config.get('tokenConfig');

let verifyToken = (req, res, next) => {
    let tokenAuth = req.get('Authorization')
    jwt.verify(tokenAuth, token.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                err
            })
        }
        req.user = decoded.user;
        next();
    })
}

module.exports = verifyToken;