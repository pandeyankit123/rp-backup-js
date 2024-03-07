const mongoose = require('mongoose');

const Teacher = new mongoose.Schema({
    tid:{
        type: String,
        required: [true, 'Teacher required'],
        unique: true
    },
    name:{
        type: String,
        required: [true, 'Name required']
    },
    email:{
        type: String,
        required: [true, 'Email required'],
        unique: true,
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Enter email in valid format']
    },
    password:{
        type: String,
        required: true
    }
});
module.exports = mongoose.model('teacher', Teacher);