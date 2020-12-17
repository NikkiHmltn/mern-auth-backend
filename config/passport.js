require('dotenv').config();

// A passport strategy for auth with a JSON web token
// This allows us to authenticate endpoints using a token
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-Jwt').ExtractJwt;

const options = {};

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//JWT_SECRET is inside of our environment
options.secretOrKey = process.env.JWT_SECRET;


module.exports = (passport) => {
    passport.use(new JwtStrategy(options, (jwt_payload, done)=> {
        //have a user that we're going to find by the id in the payload
        //when we get a user back, we will check if user is in database
    }))
}