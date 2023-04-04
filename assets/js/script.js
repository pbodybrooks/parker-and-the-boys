// API Keys:
let OpenWeatherAPIKey = "fe8c1985df685a70d00e6d5098ec6a2d";

// Global Vars
let lat;
let lon;
let userLat;
let userLon;
let city = "tulsa";

const testBtnEl1 = document.querySelector("#test-btn1");
const testBtnEl2 = document.querySelector("#test-btn2");
const testBtnEl3 = document.querySelector("#test-btn3");

function getCoords(city){
    const geoURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + OpenWeatherAPIKey;
        // fetch geo data
        fetch(geoURL)
            .then(function (response) {
            // get JSON format response
            return response.json();
            })
            // get latitude and longitude
            .then(function (geoData) {
            // store latitude and longitude values
            lat = parseInt(geoData.coord.lat);
            lon = parseInt(geoData.coord.lon);
            console.log("Function: getCoords \nLat: " + lat + "\nLon: " + lon);
            

            // getForecast(lat, lon, city);
            // getLocation(lat, lon);
            // return(lat, lon);
            })    
}

function getForecast(lat, lon, city){
    let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + OpenWeatherAPIKey + "&units=imperial";
    console.log(city + " Lat: " + lat + "\nLon: " + lon);
    // fetch forecast data
    fetch(forecastURL)
        .then(function (response) {
        return response.json();
        })
        .then(function (forecastData) {
        console.log('Five Day Forecast in ' + city + " is:");
        console.log(forecastData);
        })
}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      console.log("Geolocation is not supported by this browser.")
    }
}

// parseInt

function showPosition(position, lat, lon) {
    userLat = parseInt(position.coords.latitude);
    userLon = parseInt(position.coords.longitude);
    // console.log("Type:")
    // console.log(typeof userLat);
    console.log("Function: showPosition\nLat: " + lat + "\nLon: " + lon + "\nuserLat: " + userLat + "\nuserLon: " + userLon);
    // getDistance(userLat, userLon, lat, lon);
    return (userLat, userLon);
}


function getDistance(userLat, userLon, lat, lon) {
    const R = 6371; // Radius of the earth in km
    console.log("Function: getDistance\nLat: " + lat + "\nLon: " + lon + "\nuserLat: " + userLat + "\nuserLon: " + userLon);
    // console.clear();
    const dLat = deg2rad(userLat-lat);  // deg2rad below
    const dLon = deg2rad(userLon-lon); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat)) * Math.cos(deg2rad(userLat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    console.log("Distance: " + d);
    return d;
}

function deg2rad(deg) {
return deg * (Math.PI/180)
}


  
// window.addEventListener('load', getCoords(city));
// window.addEventListener('load', getLocation);
// window.addEventListener('load', getDistance);

testBtnEl1.addEventListener("click", getCoords(city));
testBtnEl2.addEventListener("click", getLocation);
testBtnEl3.addEventListener("click", getDistance(userLat, userLon, lat, lon));



// window.addEventListener('load', logCoords(lat, lon, userLat, userLon))
// function logCoords(lat, lon, userLat, userLon){
//     console.log("Global Scope\nLat: " + lat + "\nLon: " + lon + "\nuserLat: " + userLat + "\nuserLon: " + userLon);
// }






