const express = require('express');
const usersModel = require('../models/users_model');
const route = express.Router();
const Joi = require('Joi');

const schema = Joi.object({
    name: Joi.string()        
        .min(3)
        .max(15)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});

route.get('/', (req, res) => {
    result = searchUserList();
    
    result.then(list => {
        res.json(list)
    }).catch(err => {
        res.status(400).json({
            err
        })
    });
});

route.post('/', (req,res) => {
    const {error, value} = schema.validate({name : req.body.name, email : req.body.email});
    if (!error) {
        let result = createUser(req.body);
        result.then(value => {
            res.json({
                val : value 
            })
        }).catch(err => {
                res.status(400).json({
                    err
            })
        });
    }else {
        res.status(400).json({
            error 
        });
    };
});

route.put('/:email', (req,res) => {

    const {error, value} = schema.validate({name : req.body.name});
    if(!error){
        let result = updateUser(req.params.email, req.body)
        result.then( value => {
            res.json({
                value 
            })
        }).catch(err => {
            res.status(400).json({
                err
            })
        });
        return result;
    }else {
        res.status(400).json({
            error 
        })
    }
});

route.delete('/:email', (req,res) => {
    let email = req.params.email;
    let result = changeStatus(email)
    
    result.then(value => { 
        res.json({
            value 
        })
    }).catch(err => {
        res.status(400).json({
            err
        })
    });
    return result;
});

async function searchUserList() {
    let usersList = await usersModel.find({'status' : true})
    return usersList;
}

async function createUser(body) {
    let user = new usersModel({
        name    : body.name,
        email   : body.email,
        password: body.password,
    });
    return await user.save();
}

async function updateUser(email, body) {
    let user = await usersModel.findOneAndUpdate({'email' : email}, {
        $set: {
            name : body.name,
            password : body.password
        }
    },{new : true});
    
    return user 
};

async function changeStatus(email) {
    let user = await usersModel.findOneAndUpdate({'email' : email}, {
        $set : {
            status : false
        }
    }, {new : true});

    return user
}

module.exports = route;