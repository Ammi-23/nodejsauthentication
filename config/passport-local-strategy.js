const passport= require('passport');
const LocalStrategy= require('passport-local').Strategy;
const User= require('../model/user');
const bcrypt= require('bcryptjs');

//authentication using passport
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback: true

    },
    function(req, email,password, done){
        //find the user and establish the identity
        User.findOne({email:email
        }).then((user) =>{
            //check if the password match 
            let isEqual= user.validPassword(password);
            // if user not found or the password doesnot match
            if(!user || !isEqual){
                req.flash('error','Invalid username/password');
                return done(null, false);
            } 
            // if user is found it will return the user 
            return done(null, user);
        })
        .catch((err) => {
            req.flash('error','error in finding the user');
            return done(err);
        });
        
    }
));

//serializing the user to decide which key/property to kept in cookie
passport.serializeUser(function(user,done){
    done(null, user.id);
});

//deserializing the user from the key in the cookie
passport.deserializeUser(function(id,done){
    User.findById(id).then((user) =>{
        return done(null,user);
    })
    .catch((err)=>{        
        console.log('Error in finding user');
        return done(err);
    });
});

//check if the user is authenticated
passport.checkAuthentication= function(req,res,next){
    //if the user is signed in, then request is passed to next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    //if the user is not signed in
    return res.redirect('/sign-in');
}

passport.setAuthenticatedUser= function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user= req.user;
    }
    next();
}

module.exports=passport;