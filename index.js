const express= require('express');
const port= 3000;
const app= express();
app.use('/', require("./routes"))

app.listen(port, function(err){
    if(err){
        console.log("Error in loading the Server")
    }
    console.log(`Server is running on port: ${port} `);
})