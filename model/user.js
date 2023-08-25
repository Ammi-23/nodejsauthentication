const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');

//create a schema for user
const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{
        timestamp:true
    }
);

// hash the password
userSchema.methods.generateHash = function(password) {
    try {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    } catch (error) {
        console.log('Error***', error)
    }
};
  
// checking if password is valid
userSchema.methods.validPassword = function(password) {  
    return bcrypt.compareSync(password, this.password);
};


const User= mongoose.model('user', userSchema);
module.exports= User;
