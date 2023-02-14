const express= require('express');
const env= require('./config/environment');
const logger= require('morgan');
const cookieParser= require("cookie-parser");
const port= 2000;
const app= express();
const expressLayouts= require("express-ejs-layouts");
const db= require("./config/mongoose");
//used for session cookie
const session =require('express-session');
const passport= require('passport');
const passportLocal= require("./config/passport-local-strategy");
const passportJWT= require("./config/passport-jwt-strategy");
const passportGoogle= require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware= require("node-sass-middleware");
const flash= require('connect-flash');
const redis= require('redis');
const queue= require('./config/kue');


const customMware= require('./config/middleware');
//set up chat server to be used with socket.io
const chatServer= require('http').Server(app);
const chatSockets= require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(678);
console.log('chat server is listening on port 443');
const path= require('path');
if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname,env.asset_path,'scss'),
        dest: path.join(__dirname,env.asset_path,'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    
    }));

}




app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(env.asset_path));

app.use(expressLayouts);

app.set("layout extractStyles",true);
app.set("layout extractScripts",true);
//make the uploads path available
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(logger(env.morgan.mode, env.morgan.options));
app.set("view engine","ejs");
app.set('views','./views');
//mongostore is used to store the session cookie in the db
app.use(session({
    name: "codeial",
    //TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    store: MongoStore.create ({
        
        mongoUrl:`mongodb://localhost/codeial_development`,
        autoRemove:'disabled'
    
},
    function(err){
        console.log(err || "connect-mongodb setup ok");

    }
    ),
    
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
app.use('/', require("./routes"))



app.listen(port, function(err){
    if(err){
        console.log("Error in loading the Server")
    }
    console.log(`Server is running on port: ${port} `);
})