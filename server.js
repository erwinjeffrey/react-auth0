const express = require('express');
require("dotenv").config();

const jwt = require('express-jwt'); // Validate JWT and set req.user
const jwksRsa = require('jwks-rsa');// Retrieve RSA keys from a JSON web key set (JWKS) endpoint
const checkScope = require('express-jwt-authz');// Validate JWT scopes

const checkJWT = jwt({
    // Dynamically provide a signing key based on the kid in the header
    // and the signing keys provided by the JWKS endpoint
    secret: jwksRsa.expressJwtSecret({
        cache: true, //cache the signing key
        rateLimit: true,
        jwksRequestsPerMinute: 5,// prevent attakers from requesting more than 5 per minute
        jwksUri: `https://${
            process.env.REACT_APP_AUTH0_DOMAIN
        }/.well-known/jwks.json`
    }),

    //Validate the audience and the issuer.
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    issuer:`https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

    //This must match the algoritm selected in the Auth0 dasboard under your app's advanced settings under the OAuth tab
    algorithms: ['RS256']
});
const app = express();

app.get('/public', (req, res)=>{
    res.json({
        message: "Hello from a public API!"
    });
});

app.get('/private', checkJWT, (req, res)=>{
    res.json({
        message: "Hello from a private API!"
    });
});

app.get('/courses', checkJWT,checkScope(['read:courses']), (req, res) => {
    res.json({
        courses: [
            { id: 1, title: 'Building Apps with React and Redux'},
            { id: 2, title: 'Creating Reusable React Components'}
        ]
    });
});

checkRole = (role) => {
    return (req, res, next) => {
        const assignedRoles = req.user['http://localhost:3000/roles'];
        if(Array.isArray(assignedRoles) && assignedRoles.includes(role)){
            return next;
        }else {
            return res.status(401).send('Insufficient role');
        }
    }
}

app.get('/admin', checkJWT, checkRole('admin'), (req, res)=>{
    res.json({
        message: "Hello from an admin API!"
    });
});

app.listen(3001, ()=> {
    console.log("API server listening on " + process.env.REACT_APP_AUTH0_AUDIENCE);
});