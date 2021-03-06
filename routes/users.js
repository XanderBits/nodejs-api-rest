const express = require('express');
const usersModel = require('../models/users_model');
const route = express.Router();
const verifyToken = require('../middlewares/auth');
const Joi = require('Joi');
const bcrypt = require('bcrypt');

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

route.get('/',verifyToken,(req, res) => {
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
    //Schema validation to user name and user email
    const {error, value} = schema.validate({name : req.body.name, email : req.body.email});

    if (!error) {
        // User email validation: Prevents email duplication
        let emailVal = usersModel.findOne({'email' : req.body.email})
        
        //if email exists send a message, else create the new user
        emailVal.then(result => {
            if(result) {
                return res.status(400).json({message : "User email already exists"})
            }else {
                let user = createUser(req.body);
                user.then(value => {
                    res.json({
                        name    : value.name,
                        email   : value.email
                    })
                }).catch(err => {
                        res.status(400).json({
                            err
                        })
                })
            }
            return result;
        }).catch(err => res.status(400).json({Error : "Server error"}));
    }else{
        res.status(400).json({
            error 
        });
    };
});

route.put('/:email',verifyToken, (req,res) => {

    const {error, value} = schema.validate({name : req.body.name});
    if(!error){
        let result = updateUser(req.params.email, req.body)
        result.then( value => {
            res.json({
                name    : value.name,
                email   : value.email
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

route.delete('/:email', verifyToken, (req,res) => {
    let email = req.params.email;
    let result = changeStatus(email)
    
    result.then(value => { 
        res.json({
            name    : value.name,
            email   : value.email
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
        .select({name:1,email:1});
    return usersList;
}

async function createUser(body) {
    let user = new usersModel({
        name    : body.name,
        email   : body.email,
        password: bcrypt.hashSync(body.password, 10)
    });
    return await user.save();
}

async function updateUser(email, body) {
    let user = await usersModel.findOneAndUpdate({'email' : email}, {
        $set: {
            name        : body.name,
            password    : body.password
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
