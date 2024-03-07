const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.post('/getStudentResult', async(req, res) => {
    const { id, motherName } = req.body;

    let student = await Student.findOne({ sid: id, Mname: motherName });

    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
});

module.exports = router