// 30-day Forecast URL: https://pro.openweathermap.org/data/2.5/forecast/climate?lat={lat}&lon={lon}&appid={API key}
// GEO URL http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}
// forecast30URL = "https://pro.openweathermap.org/data/2.5/forecast/climate?lat=" + lat + "&lon=" + lon + "&appid=" + OpenWeatherAPIKey;
// "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + OpenWeatherAPIKey;

// API Keys:
const OpenWeatherAPIKey = "fe8c1985df685a70d00e6d5098ec6a2d";

// Global Vars
let lat;
let lon;
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
            console.log("Lat: " + lat + "\nLon: " + lon);
            })
            
            getForecast();
}

function getForecast(lat, lon){
    forecast30URL = "https://pro.openweathermap.org/data/2.5/forecast/climate?lat=" + lat + "&lon=" + lon + "&appid=" + OpenWeatherAPIKey;
    // fetch forecast data
    fetch(forecast30URL)
        .then(function (response) {
        return response.json();
        })
        .then(function (forecastData) {
        console.log('The thirty-day forecast in ' + city + "is:");
        console.log(forecastData);

}

window.addEventListener('load', getCoords(city));





