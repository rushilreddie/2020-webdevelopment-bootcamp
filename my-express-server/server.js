const express= require("express");
const app = express();

app.get("/", function(req, res){
    res.send("<h1>Hello world</h1>");
});

app.get("/contact", function(req, res){
    res.send("Email at rajarushil@com");
});

app.get("/about", function(req, res){
    res.send("My name is rushil a new deloper");
});


app.listen(3000, function(){
    console.log("server started on port 3000 ")
});