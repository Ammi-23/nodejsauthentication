const express= require('express');
const router= express.Router();
const passport= require('passport');
const userController= require('../controller/user_controller');

//get the homepage or signup page
router.get('/', userController.home); 

// create new user in db
router.post('/sign-up', userController.signup);

//get to the sign-in page
router.get('/sign-in', userController.signin);

//get to the profile page
router.get('/profile',passport.checkAuthentication, userController.profile);

//sign-out route
router.get('/sign-out', userController.signout);

//get to the reset page
router.get('/reset/:id', userController.reset);

//to update password
router.post('/reset-pwd', userController.resetPwd);

// use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate('local',{failureRedirect:'/sign-in'}),userController.createsession);

// google authentication route
router.get('/auth/google',passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/sign-in' }), userController.createsession);

//console.log('router loaded');
module.exports= router;