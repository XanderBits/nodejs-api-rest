const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type: String,
        unique: true,
        required : true
    },
    password :{ 
        type: String,
        required : true
    },
    status : {
        type: Boolean,
        default : true
    },
    picture : {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('userModel', userSchema);