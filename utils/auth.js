// import jwt
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const expiration = '2h';

function authMiddleware(req, res, next) {
    // define the token, so it can come from multiple sources, either the headers, the body, or the query itself
    // need to basically check first if the req.body exists to then get the token and void a server crash for the request
    let token = (req.body && req.body.token) || req.query.token || req.headers.authorization;

    // if the token is in Auth header, remove the bearer prefix
    if (req.headers.authorization) {
        token = token.split(" ").pop().trim();
    }

    // if there isn't a token, then the user isn't authorized return a status
    if (!token) {
        return res.status(401).json({ message: "No token provided. Not authorized" });
    }

    // if there is a token, verify the token with jwt
    try {
        const { data } = jwt.verify(token, secret, { maxAge: expiration });

        // attach the user to the request by adding a field for it
        req.user = data;

        // take the next middleware
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}

module.exports = authMiddleware;