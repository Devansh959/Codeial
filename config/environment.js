const fs= require('fs');
const rfs= require('rotating-file-stream');
const path= require('path');

const logDirectory= path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});
const development={
    name:'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host:'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user:'vermashubham5000@gmail.com',
            pass:'epfxapghacotfxpw'
        }
    },
    google_client_id: "622608666504-v53cvj8ptf1ok1u2b3qcj2lqo5vvvcfi.apps.googleusercontent.com",
    google_client_Secret: "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",
    google_call_back_URL: "http://localhost:2000/users/auth/google/callback",
    jwt_secret: 'codeial',
    morgan:{
        mode:'dev',
        options: {stream: accessLogStream}
  }



}
const production={
    name:'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db:process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host:'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user:process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD,
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_Secret:process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_URL: process.env.CODEIAL_GOOGLE_CALL_BACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan:{
        mode:'combined',
        options: {stream: accessLogStream}
  }
}
module.exports= eval(process.env.CODEIAL_ENVIRONMENT)== undefined? development:eval(process.env.CODEIAL_ENVIRONMENT);