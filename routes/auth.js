const express = require('express');
const usersModel = require('../models/users_model');
const route = express.Router();
const bcrypt = require('bcrypt');


route.post('/', (req,res) => {
    usersModel.findOne({'email' : req.body.email})
        .then(result => {
            if(result){
                const passwordVal = bcrypt.compareSync(req.body.password, result.password);
                if(!passwordVal) return res.status(400).json({Message : "Invalid user or password "});
                res.json(result);
            }else{
                res.status(400).json({Message : "Invalid user or password "});
            }
        })
        .catch(err => {
            res.status(400).json({Error: "Service error" + err})
        })
})

module.exports = route;