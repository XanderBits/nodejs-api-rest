const mongoose = require('mongoose');
const schema = mongoose.Schema;

const courseSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    author : {
        type: schema.Types.ObjectId, ref: 'userModel'
    },
    description : {
        type: String,
        required : false
    },
    status : {
        type: Boolean,
        default : true
    },
    picture : {
        type: String,
        required: false
    },
    students : {
        type: Number,
        default : 0
    },
    rating : {
        type: Number,
        default: 0
    }

})

module.exports = mongoose.model('courseModel', courseSchema);