const express = require('express');
const route = express.Router();
const courseModel = require('../models/courses_models');
const verifyToken = require('../middlewares/auth');

route.get('/', verifyToken, (req, res) => {

    result = searchCourseList();
    result.then(list => {
        res.json(list)
    }).catch(err => {
        res.status(400).json({
            err
        })
    });
});

route.post('/', verifyToken, (req,res) => {
    let result = createCourse(req);
    result.then(value => {
        res.json({
            value
        });
    }).catch(err => {
        res.status(400).json({
            err 
        });
    });
});

route.put('/:id', verifyToken, (req,res) => {
    let result = updateCourse(req.params.id, req.body)
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
});

route.delete('/:id', verifyToken, (req,res) => {
    
    let result = changeStatus(req.params.id);
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

async function searchCourseList() {
    let courseList = await courseModel
    .find({'status' : true})
    .populate('author', 'name-_id');
    return courseList;
}

async function createCourse(req) {
    let course = new courseModel({
        title           : req.body.title,
        author          : req.user._id,
        description     : req.body.description
    });

    return await course.save();
};

async function updateCourse(id, body) {
    let course = await courseModel.findByIdAndUpdate(id,{
        $set : {
            title           : body.title,
            description     : body.description
        },
    },{new: true});

    return course
};

async function changeStatus(id) {
    let course = await courseModel.findByIdAndUpdate(id, {
        $set : {
            status : false
        }
    }, {new : true});

    return course
};

module.exports = route; 

