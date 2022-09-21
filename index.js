const express= require('express');
const port= 3000;
const app= express();
const expressLayouts= require("express-ejs-layouts");
app.use(express.static("./assets"));
app.use(expressLayouts);
app.use('/', require("./routes"))
app.set("layout extractStyles",true);
app.set("layout extractScripts",true);

app.set("view engine","ejs");
app.set('views','./views');


app.listen(port, function(err){
    if(err){
        console.log("Error in loading the Server")
    }
    console.log(`Server is running on port: ${port} `);
})