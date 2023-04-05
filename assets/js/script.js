// API Keys:
let OpenWeatherAPIKey = "fe8c1985df685a70d00e6d5098ec6a2d";

// Global Vars
let lat;
let lon;
let userLat;
let userLon;

const delay = 5000;

const simulateSubmitBtn = document.querySelector("#simulate-submit");
const fillWeatherBankBtn = document.querySelector("#fill-weatherBank");



let MVPcityBank = ["Tulsa", "Salt Lake City", "Los Angeles", "Las Vegas", "Denver", "Kalispell", "Seattle", "Austin", "Cheyenne", "San Francisco", "Miami"];;
let weatherBank = [];

function fillWeatherBank (){
    MVPcityBank.forEach(city => {
        getCoords(city);
        return weatherBank
    })
    console.log("Weather Bank: ");
    console.log(weatherBank);
    return weatherBank;
}

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
            lat = parseFloat(geoData.coord.lat);
            lon = parseFloat(geoData.coord.lon);

            // console.log("Function: getCoords \nLat: " + lat + "\nLon: " + lon);
            getForecast(lat, lon, city);
        })    
}

function getForecast(lat, lon, city){
    let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + OpenWeatherAPIKey + "&units=imperial";
    // console.log(city + " Lat: " + lat + "\nLon: " + lon);
    // fetch forecast data
    fetch(forecastURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (forecastData) {        
            let weather = {
                city: forecastData.city.name,
                temperature: forecastData.list[0].main.temp,
                wind: forecastData.list[0].wind.speed < 10 ? "low" : "high",
                weather: forecastData.list[0].weather[0].main
            };
            weatherBank.push(weather);
        })
}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      alert('Geolocation may not be supported by this browser. Please ensure Location Access is set to "Allowed"')
    }
}

function showPosition(position) {
    userLat = parseFloat(position.coords.latitude);
    userLon = parseFloat(position.coords.longitude);
    console.log("Function: showPosition\nuserLat: " + userLat + "\nuserLon: " + userLon);
    // getDistance(userLat, userLon, lat, lon);
    return (userLat, userLon);
}

function getDistance(userLat, userLon, lat, lon, city, weatherBank) {
    const R = 3958.8; // Radius of the earth in miles
    console.log("Function: getDistance\nLat: " + lat + "\nLon: " + lon + "\nuserLat: " + userLat + "\nuserLon: " + userLon);

    const dLat = deg2rad(userLat-lat);
    const dLon = deg2rad(userLon-lon); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat)) * Math.cos(deg2rad(userLat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = Math.round(R * c);
    console.log("Distance between your current location and " + city + " is approximately " + distance + " miles.");
    weatherBank["distance"] = "distance";
    return distance;
}

function deg2rad(deg) {
return deg * (Math.PI/180)
}

function simulateSubmittedCritera() {
    getCoords(city);
    getLocation();
    setTimeout(function () {
        getDistance(userLat, userLon, lat, lon, city);
    }, delay); 
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

simulateSubmitBtn.addEventListener("click", simulateSubmittedCritera);
fillWeatherBankBtn.addEventListener("click", fillWeatherBank);



////////////////////////////// ASYNC Await Function //////////////////////////////
// function getLocation() {
//     return new Promise((resolve, reject) => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(resolve, reject);
//         } else {
//             reject(new Error("Geolocation is not supported by this browser."));
//         }
//     });
// }

// function showPosition(position) {
//     return new Promise((resolve) => {
//         userLat = parseInt(position.coords.latitude);
//         userLon = parseInt(position.coords.longitude);
//         console.log("Function: showPosition\nLat: " + lat + "\nLon: " + lon + "\nuserLat: " + userLat + "\nuserLon: " + userLon);
//         resolve({ userLat, userLon });
//     });
// }

// async function simulateSubmittedCritera() {
//     getCoords(city);
//     try {
//         const position = await getLocation();
//         const { userLat, userLon } = await showPosition(position);
//         getDistance(userLat, userLon, lat, lon, city);
//     } catch (error) {
//         console.error("Error:", error);
//     }
// }
////////////////////////////// //////////////// //////////////////////////////