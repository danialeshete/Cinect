const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// Create middleware for checking the JWT
const checkJwt = jwt({
    // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://cinect.eu.auth0.com/.well-known/jwks.json`
    }),
  
    // Validate the audience and the issuer
    audience: 'https://cinect.eu.auth0.com/api/v2/', //replace with your API's audience, available at Dashboard > APIs
    issuer: 'https://cinect.eu.auth0.com/',
    algorithms: [ 'RS256' ]
});

module.exports = {
    checkJwt,
};