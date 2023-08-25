
const express= require('express');
const cookieParser= require('cookie-parser');
const expressLayouts= require('express-ejs-layouts');
const db=require('./config/mongoose'); // for database
const port=5500; //declaring port for the application
const app= express();
const session=require('express-session');// used for session cookie
//for passport
const passport= require('passport'); 
const passportLocal= require('./config/passport-local-strategy'); 
const passportGoogle= require('./config/passport-google-oauth2-strategy');

const MongoStore= require('connect-mongo');


app.use(express.urlencoded());
app.use(cookieParser());

//setup express ejs layouts
app.use(expressLayouts); 

//set up view engine and view folder
app.set('view engine', 'ejs');
app.set('views', './views');

//set up asset files
app.use(express.static('./asset'));

//extract style and scripts from subpages into the layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


// Initialize and configure express session as middle ware to save sessions
app.use(session({
    name:'profile',
    secret: 'black',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://ammi:Lock&key23@nodejs-authentication.kcpqqpo.mongodb.net/?retryWrites=true&w=majority',
        autoRemove:'disabled'
    },
    function(err){
        console.log(err|| 'connect-mongodb setup ok');
    })
}));

const flash = require("connect-flash");
const customMiddleware = require("./config/middleware");

//middleware to use session of passport and initialize it
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//set up flash and middleware to passthe message to view
app.use(flash());
app.use(customMiddleware.setflash);


// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log('error in running the server',err);
    }
    console.log('server is running on port:', port)
});