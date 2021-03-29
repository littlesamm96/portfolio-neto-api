const jwt = require('express-jwt')
const jwksRSA = require('jwks-rsa')
const config = require('../config')
const request = require('request')

exports.checkJWT = jwt({

    secret: jwksRSA.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestPerMinute: 10,
        jwksUri: 'https://dev-d4cbohlh.us.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://dev-d4cbohlh.us.auth0.com/api/v2/',
    issuer: 'https://dev-d4cbohlh.us.auth0.com/',
    algorithms: ['RS256']
})

exports.checkRole = role => (req, res, next) => {

    const user = req.user

    if (user && user[config.AUTH0_NAMESPACE + '/roles'].includes(role)) {
        next()
    } else {
        return res.status(401).send('You are not authorized to access this resource!')
    }
}
    
exports.getAccessToken = () => {
    const options = {
        method: 'POST',
        url: config.AUTH0_TOKEN_URL,
        headers: {
            'content-type': 'application/json'
        },
        form: {
            grant_type: 'client_credentials',
            client_id: config.AUTH0_CLIENT_ID,
            client_secret: config.AUTH0_CLIENT_SECRET,
            audience: config.AUTH0_AUDIENCE
        }
    }

    return new Promise((resolve, reject) => {
        request(options, (error, res, body) => {
            if (error) { return reject(new Error(error)) }
            resolve(body ? JSON.parse(body) : '')
        })
    })
}

exports.getAuth0User = (accessToken, userId) => {
    const options = {
        method: 'GET',
        url: `${config.AUTH0_DOMAIN}/api/v2/users/${userId}?fields=name,picture,user_id`,
        headers: {
            authorization: `Bearer ${accessToken}`
        }
    }

    return new Promise((resolve, reject) => {
        request(options, (error, res, body) => {
            if (error) { return reject(new Error(error)) }
            resolve(body ? JSON.parse(body) : '')
        })
    })
}