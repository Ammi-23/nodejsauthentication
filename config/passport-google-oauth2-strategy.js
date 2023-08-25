const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../model/user');

// tell passport to use new strategy for google login
passport.use(new googleStrategy({
        clientID: process.env.client_id,
        clientSecret: process.env.client_secret,
        callbackURL: process.env.callback_url,
        passReqToCallback: true

    },
    async function(req, accessToken, refreshToken, profile, done) {
        try {
            //find the user
            const user = await User.findOne({ email: profile.emails[0].value });
            //if found, set it as req.user
            if (user) {
                return done(null, user);
            }
            if (!user) {
                // if not found, create user and set it as req.user
                const newUser = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                })
                if (newUser) {
                    return done(null, newUser);
                }

            }

        } catch (error) {
            console.log('error in google strategy passport', error);
        }

    }
));

module.exports= passport;