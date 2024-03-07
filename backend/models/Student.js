const mongoose = require('mongoose');

const Student = new mongoose.Schema({
    teach:{
        type: String,
        ref: 'teach'
    },
    sid:{
        type: String,
        required: [true, 'Sid required'],
        unique: true
    },
    name:{
        type: String,
        required: [true, 'Name required']
    },
    Fname:{
        type: String,
        required: [true, 'Father\'s Name required']
    },
    Mname:{
        type: String,
        required: [true, 'Mother\'s Name required']
    },
    DOB:{
        type: Date,
        required: true
    },
    classn:{
        type: String,
        required: [true, 'class required']
    },
    mScience:{
        type: Number,
        default: "00"
    },
    mMaths:{
        type: Number,
        default: "00"
    },
    mSST:{
        type: Number,
        default: "00"
    },
    mEnglish:{
        type: Number,
        default: "00"
    },
    mHindi:{
        type: Number,
        default: "00"
    },
    mCoo:{
        type: Number,
        default: "00"
    }
});
module.exports = mongoose.model('Stud', Student);