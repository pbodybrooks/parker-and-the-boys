// API Keys:
let OpenWeatherAPIKey = "fe8c1985df685a70d00e6d5098ec6a2d";

// Global Vars
let lat;
let lon;
let userLat;
let userLon;
let city = toTitleCase("tulsa");

const delayInMilliseconds = 1000; //1 second

const simulateSubmitBtn = document.querySelector("#simulate-submit");
const fillWeatherBankBtn = document.querySelector("#fill-weatherBank");

// const testBtnEl = document.querySelector("#test-btn");
// const testBtnEl2 = document.querySelector("#test-btn2");
// const testBtnEl3 = document.querySelector("#test-btn3");

//query user for:
// temperature
// humidity
// wind (low - < 10mph or high > 10 mph)
// weather (thunder/drizzle/rain/snow/clear/clouds)

MVPcityBank = ["Tulsa", "Salt Lake City", "Los Angeles", "Las Vegas", "Denver", "Kalispell", "Seattle", "Austin", "Cheyenne", "San Francisco", "Miami"];
let weatherBank = [];

function fillWeatherBank (){
    MVPcityBank.forEach(city => {
        getCoords(city);
        return weatherBank
    })
    console.log("Weather Bank: ");
    console.log(weatherBank)
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
            lat = parseInt(geoData.coord.lat);
            lon = parseInt(geoData.coord.lon);
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
        // console.log('Five Day Forecast in ' + city + " is:");
        // console.log(forecastData);
        
        let weather = {
            city: forecastData.city.name,
            temperature: forecastData.list[0].main.temp,
            // humidity: forecastData.list[0].main.humidity,
            wind: forecastData.list[0].wind.speed < 10 ? "low" : "high",
            weather: forecastData.list[0].weather[0].main
        };
        weatherBank.push(weather);
        })
        // return weatherBank;
    // console.log(weatherBank);
}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      alert("Geolocation may not be supported by this browser. Please ensure Location Access is Allowed")
    }
}

// function getLocation() {
//     return new Promise((resolve, reject) => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(resolve, reject);
//         } else {
//             reject(new Error("Geolocation is not supported by this browser."));
//         }
//     });
// }

function showPosition(position) {
    userLat = parseInt(position.coords.latitude);
    userLon = parseInt(position.coords.longitude);
    // console.log("Type:")
    // console.log(typeof userLat);
    console.log("Function: showPosition\nuserLat: " + userLat + "\nuserLon: " + userLon);
    // getDistance(userLat, userLon, lat, lon);
    return (userLat, userLon);
}

// function showPosition(position) {
//     return new Promise((resolve) => {
//         userLat = parseInt(position.coords.latitude);
//         userLon = parseInt(position.coords.longitude);
//         console.log("Function: showPosition\nLat: " + lat + "\nLon: " + lon + "\nuserLat: " + userLat + "\nuserLon: " + userLon);
//         resolve({ userLat, userLon });
//     });
// }

function getDistance(userLat, userLon, lat, lon, city) {
    const R = 3958.8; // Radius of the earth in miles
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
    const distance = Math.round(R * c); // Distance in km
    console.log("Distance between your current location and " + city + " is approximately " + distance + " miles.");
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
    }, 5000);
        
}

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

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

simulateSubmitBtn.addEventListener("click", simulateSubmittedCritera);

fillWeatherBankBtn.addEventListener("click", fillWeatherBank);



// const cities = [
//     salt lake city = {
//         temperature: 70
//         humid
//     }
// ]

// window.addEventListener('load', getCoords(city));
// window.addEventListener('load', getLocation);
// window.addEventListener('load', getDistance);

// testBtnEl1.addEventListener("click", function() {
//     getCoords(city);
//   });
// testBtnEl2.addEventListener("click", getLocation);
// testBtnEl3.addEventListener("click", function() {
//     getDistance(userLat, userLon, lat, lon);
// });


// testBtnEl1.addEventListener("click", getCoords(city));
// testBtnEl2.addEventListener("click", getLocation);
// testBtnEl3.addEventListener("click", getDistance(userLat, userLon, lat, lon));



// window.addEventListener('load', logCoords(lat, lon, userLat, userLon))
// function logCoords(lat, lon, userLat, userLon){
//     console.log("Global Scope\nLat: " + lat + "\nLon: " + lon + "\nuserLat: " + userLat + "\nuserLon: " + userLon);
// }





