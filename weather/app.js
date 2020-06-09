const express = require("express")
const https= require("http")
const bodyParser = require("body-parser")

const app = express()


app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
  res.sendFile(__dirname +  "/index.html");

});

app.post("/" , function(req, res){

    const query= req.body.cityName;
    const apiKey= "733023d77a5e5004f0f181f14ed12f62";
    const units = "metric";
        const url= "http://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ apiKey +"&units="+ units
      https.get(url, function(response){
         console.log(response.statusCode);
    
    response.on ("data", function(data){
        const weatherData= JSON.parse(data);
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
       const icon= weatherData.weather[0].icon
       const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
       
        res.write("<p>The weather is currently "+ weatherDescription + "<p>");
        res.write("<h1>The temperature in " + query +" is " + temp + " degrees celcius.</h1>");
        res.write("<img src=" + imageURL + ">");
        res.send();
    });
      });
    
})



app.listen( 300, function(){
    console.log("Server is connected");
})