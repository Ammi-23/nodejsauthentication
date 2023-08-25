const { session } = require('passport');
const User= require('../model/user');
const bcrypt = require('bcryptjs');



//render sign up/home page
module.exports.home= function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/profile');
    }
    return res.render('userSignUp',{title:'home page'});
}

//create new user in db
module.exports.signup= async function(req,res){
    // get user input from request
    const {name, email, password, confirm_password}= req.body;
    //to check if password and confirm password match or not
    if(password!= confirm_password){
        req.flash('error', 'password and confirm password does not match');
        return res.redirect('/');
    }
    //checkif the user already have an account
    let user= await User.findOne({email: email})
    if(!user){  //if not,create user with the input
        User.create({
            name: name,
            email: email,
            password: password
           })
           .then((newUser) => {
                // hash the password
                newUser.password = newUser.generateHash(password);
                newUser.save();
                return res.redirect('/sign-in');
           })
           .catch((err) => {
               console.log(err);
               return res.redirect('/');
           }); 
    }else{
        //if user already exist
        req.flash('error','User already exist');
        return res.redirect('/');
    }
}
//render sign in page
module.exports.signin= function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/profile');
    }
    return res.render('userSignIn',{title:'sign-in page'});
}

// sign in and create a session for the user
module.exports.createsession= async function(req,res){
    req.flash('success','Logged in Successfully');
    return res.redirect('/profile');
}

//render profile page
module.exports.profile= function(req,res){
    return res.render('profile',{title:'profile page'});
}

//render resetpage
module.exports.reset = async function(req, res) {
    let user= await User.findById(req.params.id);
    return res.render('resetPassword',{title:'Reset Page',user});
}
// reset the password and update in db
module.exports.resetPwd= async function(req,res){
    const { email, oldpassword,newpassword } = req.body

    const user = await User.findOne({email:email});
    // check if the password match with the old password
    let isEqual=user.validPassword(oldpassword);
    if (!isEqual) {
        req.flash('error', 'current password does not match');
        return res.redirect('back');
    }
    //hash the password and store
    user.password = user.generateHash(newpassword);
    user.save(); 
    req.flash('success', 'password updated successfully');
    res.redirect('/sign-in');

}


//Signout or remove the session 
module.exports.signout= function(req, res){
    req.session.destroy();
    res.redirect('/sign-in');
  };