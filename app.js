/*
    Setup this project to your GitHub repo you will be handing in a link of the completed project for the exam.

    Follow the instructions in the comments to setup this Express Application. 

    Completing this app will show that you understand the General components of a NodeJs Application 
    and how to set them up.

    This application uses a middleware called forcast.io and zippity-do-dah to take users zip codes and tell
    them their general weather information.
    
    You can use any of our in class files and the internet to complete the exam.
    Don't forget to generate your pacjage.json file
*/

/*
    Step One
    Make sure you have NodeJs installed and use NPM to install the following packages
    (hint: the names of these are how they should be reffered to when installing them)
    -express
    -morgan
    -zippity-do-dah (converts zip codes to lat and lon coordinates)
    -forcast.io (returns weather info using lat and lon coordinates)

*/
var http = require('http');
var path = require("path");
var express = require("express");
var logger = require('morgan');
var zipdb = require("zippity-do-dah");
var ForecastIo = require("forecast.io");
var app = express();

/*
    Step 2 
    You will need an API Key to use forecast.io
    Sign up for an account and get your API Key here:
    https://darksky.net/dev
*/
var options = {
    APIKey: "0465dc66c71080344589bf454f54c35e",
    timeout: 1000
  };//configures the options for forecast.io

var weather = new ForecastIo(options);//creates an instance of forecast.io

/*
  Step 3
  Create a static route to the public folder.
  This will create a route to several essential JavaScript files and CSS files required for the app.
 */
app.set("public", path.resolve(__dirname, "public"));
/*
  Step 4 
  Create a route to the views folder. 
  This folder has all the ejs files for the app.
*/

/*
  Step 5 
  Set Morgan in dev mode so it logs all the requests to our server.
*/
app.use(logger("dev"));
/*
  Step 6 
  Set your view engine to ejs.
*/
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');
/*
  Step 7 
  Use a get to render the index page
*/

app.get("/", function(req, res){
    res.render("index");
});

//===The get below takes the 5 digets from the zip code and converts it to latitude and longitude coordinates 
//===It does this through an ajax request in a script in public/main.js
//===It then takes those coordinates and passes them to forecast.io and gets the weather forecast for that region
app.get(/^\/(\d{5})$/, function(req, res, next) {
    var zipcode = req.params[0];
    var location = zipdb.zipcode(zipcode);
    if (!location.zipcode) {
        next();
    return;
    }

    var latitude = location.latitude;
    var longitude = location.longitude;

    weather.get(latitude, longitude, function(err,response,data) {
        if (err) {
         next();
         return;
        }
        res.json({
            zipcode: zipcode,
            temperature: data.currently.temperature,
            summary: data.minutely.summary,
            icon:data.minutely.icon
        });
    });
});

//===Renders a 404 if the user decides to go to a different page
app.use(function(req, res) {
    res.status(404).render("404");
});

/*
    Step 8
    Setup the app to listen on port 3000 
*/
http.createServer(app).listen(3000, function(){
    console.log("Server started on port 3000");
});

/*
    Step 9 
    Configure your app to run using the command npm start
    hint(check your package.json file)
*/

//==If all is connected properly you should be now able to run the midterm app from your command line 
//==Save your files push them to your Repository and send the link in the Midterm Assignment 