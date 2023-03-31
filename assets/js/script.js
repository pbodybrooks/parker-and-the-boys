// 30-day Forecast URL: https://pro.openweathermap.org/data/2.5/forecast/climate?lat={lat}&lon={lon}&appid={API key}
// GEO URL http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}

// "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + OpenWeatherAPIKey;

// API Keys:
const OpenWeatherAPIKey = "fe8c1985df685a70d00e6d5098ec6a2d";

// Global Vars
// let lat;
// let lon;
let city = "tulsa";

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
            let lat = geoData.coord.lat;
            let lon = geoData.coord.lon;
            console.log(geoData);
            

            getForecast(lat, lon, city);
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
    userLat = position.coords.latitude;
    userLon = position.coords.longitude;
    console.log ("User lat & lon: " + userLat + userLon)

    getDistanceFromLatLonInKm(userLat, userLon, lat, lon);
}
  

window.addEventListener('load', getCoords(city));
window.addEventListener('load', getLocation);


function getDistanceFromLatLonInKm(userLat, userLon, lat, lon) {
    const R = 6371; // Radius of the earth in km
    console.clear();
    console.log("\n");
    console.log("\n");
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
  

  



