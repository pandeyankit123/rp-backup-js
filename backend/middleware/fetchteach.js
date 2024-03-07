var jwt = require('jsonwebtoken');
const JWT_SECRET = 'rpBackend';

const fetchteach = (req, res, next) => {
    // Get the teach from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.teach = data.teach;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}
module.exports = fetchteach;