const express = require('express');
const usersModel = require('../models/users_model');
const route = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('config')
const token = config.get('tokenConfig')

route.post('/', (req,res) => {
    usersModel.findOne({'email' : req.body.email})
        .then(result => {
            if(result){
                const passwordVal = bcrypt.compareSync(req.body.password, result.password);
                if(!passwordVal) return res.status(400).json({
                    Message : "Invalid user or password "
                });

                const jwebtoken = jwt.sign({
                    data: {_id: result._id, name: result.name, email: result.email}
                },token.SEED,{expiresIn: token.expiration});
                
                res.json({
                    user : {
                        _id: result._id, 
                        name: result.name, 
                        email: result.email
                    },
                    jwebtoken 
                });
                
            }else{
                res.status(400).json({Message : "Invalid user or password "});
            }
        })
        .catch(err => {
            res.status(400).json({Error: "Service error" + err})
        })
})

module.exports = route;