const express = require('express');
const Teacher = require('../models/Teacher');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchteach = require('../middleware/fetchteach');

const JWT_SECRET = 'rpBackend';

// ROUTE 1: Create a Teacher using: POST "/auth/createteach". No login required
router.post('/createteach', [
    body('tid', 'Enter a valid id').isLength({ min: 2 }),
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        // Check whether the teach with this email exists already
        let teach = await Teacher.findOne({ email: req.body.email });
        if (teach) {
            return res.status(400).json({ success, error: "Sorry a teacher with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new teacher
        teach = await Teacher.create({
            tid: req.body.tid,
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });
        const data = {
            teach: {
                tid: teach.tid
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);

        // res.json(teach)
        success = true;
        res.json({ success, authtoken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// ROUTE 2: Authenticate a Teacher using: POST "/auth/login". No login required
router.post('/login', [
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, tid, password } = req.body;
    try {
        let teach;
        if (!teach) {
            teach = await Teacher.findOne({ email });
        } if (!teach) {
            teach = await Teacher.findOne({ tid });
        }

        if (!teach) {
            success = false
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, teach.password);
        if (!passwordCompare) {
            success = false
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        const data = {
            teach: {
                tid: teach.tid
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken })
        console.log(authtoken);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 3: Get loggedin Teacher Details using: POST "/auth/getteach". Login required
router.post('/getteach', fetchteach, async (req, res) => {
    try {
        teachId = req.teach.tid;
        const teach = await Teacher.findOne({tid:teachId}).select("-password")
        res.send(teach)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router