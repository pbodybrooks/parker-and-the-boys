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

// const hotBtn = document.querySelector("#hot");
// const modBtn = document.querySelector("#mod");
// const coldBtn = document.querySelector("#cold");
const tempRangeEl = document.querySelector("#tempRange");
const windRangeEl = document.querySelector("#windRange");
const conditionsEl = document.querySelector("#conditions");
const drivingRangeEl = document.querySelector("#drivingRange");
const submitBtn = document.querySelector("#submitButton");
const cityContainerEl = document.querySelector("#citiesContainer");


function move() {
    var i = 0;
    if (i == 0) {
        i = 1;
        var elem = document.getElementById("myBar");
        var width = 1;
        var id = setInterval(frame, 40);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
            } else {
                width++;
                elem.style.width = width + "%";
            }
        }
    }
}

window.onload = function () {
    if (!localStorage.getItem("weatherBank")) {
        // run function if local storage is empty
        fillWeatherBank();
    }
}




let MVPcityBank = ["Tulsa", "Salt Lake City", "Los Angeles", "Las Vegas", "Denver", "Kalispell", "Seattle", "Austin", "Cheyenne", "San Francisco",
 "Miami", "Grand Rapids", "Albuquerque", "Phoenix", "Portland", "Eugene", "Flagstaff", "Cedar City", "Buffalo", "Billings", "Idaho Falls"];
let weatherBank = [];

function checkCities(weatherBank) {
    weatherBank = JSON.parse(localStorage.getItem("weatherBank"));
    let returnedCities = [];
    let userTemperature = (tempRangeEl.value);
    let userWind = windRangeEl.value;
    let userConditions = conditionsEl.value;
    let userRange = drivingRangeEl.value;

    if (userTemperature === "null") {
        alert("Please enter a desired temperature range.");
    }

    if (userWind === "null") {
        alert("Please enter desired wind conditions.");
    }

    if (userConditions === "null") {
        alert("Please enter desired weather conditions.");
    }

    if (userRange === "null") {
        alert("Please enter a desired distance to destination.");
    }

    for (let i = 0; i < weatherBank.length; i++) {
        let city = weatherBank[i];
        let isMatch = true;
    
        // check if the temperature is within range
        if (userTemperature === "hot" && (city.temperature === "moderate" || city.temperature === "cold")) {
            isMatch = false;
        } else if (userTemperature === "moderate" && (city.temperature === "hot" || city.temperature === "cold")) {
            isMatch = false;
        } else if (userTemperature === "cold" && (city.temperature === "hot" || city.temperature === "moderate")) {
            isMatch = false;
        }
        
        // check if the wind is within range
        if (userWind === "low" && city.wind === "high") {
          isMatch = false;
        } else if (userWind === "high" && city.wind === "low") {
          isMatch = false;
        }
    
        // check if the weather conditions match
        if (userConditions !== "" && city.weather !== userConditions) {
          isMatch = false;
        }
    
        // check if the distance is within the user's range
        if (city.distance > userRange) {
          isMatch = false;
        }
    
        if (isMatch) {
          returnedCities.push(city);
        }
      }

    returnedCities.sort((a, b) => a.distance - b.distance);
    console.log(returnedCities);

    displayCities(returnedCities)
}

function displayCities(returnedCities){
    let weatherTemplate = ``;

    for (let i = 0; i < returnedCities.length; i++){
        let city = returnedCities[i];

        let setCity = city.city;
        let setDistance = city.distance;
        let setIcon = city.icon;
        let setConditions = city.weather;
        let setTemp = city.temperatureVal;
        let setWind = city.windVal;
        
        weatherTemplate += `
        <div>
            <h3>${setCity}</h3>
            <h4>${setDistance} miles away</h4>
            <h5><img src = "${setIcon}"> ${setConditions}</h5>
            <ul id = "weatherList">
                <li>Temperature: ${setTemp}&#8457;</li>
                <li>Wind: ${setWind} mph</li> 
            </ul>
        </div>`;

        cityContainerEl.innerHTML = weatherTemplate;
    }
}
submitBtn.addEventListener("click",checkCities);

function fillWeatherBank() {

    move();

    // First, get users location coordinates
    getUserLocation().then(() => {
        // Second, after a 5 second delay:
        setTimeout(async function () {
            // For each city in the cityBank
            for (const city of MVPcityBank) {
                // Get city coordinates
                await getCoords(city);
                // Calculate distance between user and each city
                const distance = getDistance(userLat, userLon, lat, lon, city);
                // Get weather for each city and fill the weatherBank
                await getForecast(lat, lon, city, distance);
            }
            localStorage.setItem("weatherBank", JSON.stringify(weatherBank));
            console.log("Weather Bank: ");
            console.log(weatherBank);
            return weatherBank;
        }, 1000);
    });
    
}

async function getCoords(city) {
    const geoURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + OpenWeatherAPIKey;
    // fetch geo data
    const response = await fetch(geoURL);
    const geoData = await response.json();

    // store latitude and longitude values
    lat = parseFloat(geoData.coord.lat);
    lon = parseFloat(geoData.coord.lon);
}

async function getForecast(lat, lon, city, distance) {
    let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + OpenWeatherAPIKey + "&units=imperial";
    // fetch forecast data
    const response = await fetch(forecastURL);
    const forecastData = await response.json();
    // console.log(forecastData);

    let tempSetting = '';

    if (forecastData.list[0].main.temp > 80) {
        tempSetting = "hot";
    }
    else if (forecastData.list[0].main.temp < 50) {
        tempSetting = "cold";
    }
    else {
        tempSetting = "moderate";
    }

    let weather = {
        city: forecastData.city.name,
        icon: "https://openweathermap.org/img/wn/" + forecastData.list[0].weather[0].icon + "@2x.png",
        temperatureSetting: tempSetting,
        temperatureVal: forecastData.list[0].main.temp,
        windSetting: forecastData.list[0].wind.speed < 10 ? "low" : "high",
        windVal: forecastData.list[0].wind.speed, 
        weather: forecastData.list[0].weather[0].main,
        distance: distance
    };
    weatherBank.push(weather);
}

function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                userLat = parseFloat(position.coords.latitude);
                userLon = parseFloat(position.coords.longitude);
                // console.log("Function: showPosition\nuserLat: " + userLat + "\nuserLon: " + userLon);
                resolve();
            });
        } else {
            reject('Geolocation may not be supported by this browser. Please ensure Location Access is set to "Allowed"');
        }
    });
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
    // console.log("Function: getDistance\nLat: " + lat + "\nLon: " + lon + "\nuserLat: " + userLat + "\nuserLon: " + userLon);

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
    return distance;
}

function deg2rad(deg) {
return deg * (Math.PI/180)
}

function simulateSubmittedCritera() {
    localStorage.clear();
    // fillWeatherBank();
    // getCoords(city);
    // getUserLocation();
    // setTimeout(function () {
    //     getDistance(userLat, userLon, lat, lon, city);
    // }, delay); 
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

simulateSubmitBtn.addEventListener("click", simulateSubmittedCritera);
fillWeatherBankBtn.addEventListener("click", fillWeatherBank);



///////////////////////////////

// function fillWeatherBank (){
//     MVPcityBank.forEach(city => {
//         getCoords(city);
//         return weatherBank
//     })
//     console.log("Weather Bank: ");
//     console.log(weatherBank);
//     return weatherBank;
// }

// function getCoords(city){
//     const geoURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + OpenWeatherAPIKey;
//         // fetch geo data
//         fetch(geoURL)
//             .then(function (response) {
//             // get JSON format response
//             return response.json();
//             })
//             // get latitude and longitude
//             .then(function (geoData) {
//             // store latitude and longitude values
//             lat = parseFloat(geoData.coord.lat);
//             lon = parseFloat(geoData.coord.lon);

//             // console.log("Function: getCoords \nLat: " + lat + "\nLon: " + lon);
//             getForecast(lat, lon, city);
//         })    
// }

// function getForecast(lat, lon, city, distance){
//     let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + OpenWeatherAPIKey + "&units=imperial";
//     // console.log(city + " Lat: " + lat + "\nLon: " + lon);
//     // fetch forecast data
//     fetch(forecastURL)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (forecastData) {        
//             let weather = {
//                 city: forecastData.city.name,
//                 temperature: forecastData.list[0].main.temp,
//                 wind: forecastData.list[0].wind.speed < 10 ? "low" : "high",
//                 weather: forecastData.list[0].weather[0].main,
//                 distance: distance
//             };
//             weatherBank.push(weather);
//         })
// }

// function getUserLocation() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(showPosition);
//     } else { 
//       alert('Geolocation may not be supported by this browser. Please ensure Location Access is set to "Allowed"')
//     }
// }

// function showPosition(position) {
//     userLat = parseFloat(position.coords.latitude);
//     userLon = parseFloat(position.coords.longitude);
//     console.log("Function: showPosition\nuserLat: " + userLat + "\nuserLon: " + userLon);
//     // getDistance(userLat, userLon, lat, lon);
//     return (userLat, userLon);
// }

// function getDistance(userLat, userLon, lat, lon, city, weatherBank) {
//     const R = 3958.8; // Radius of the earth in miles
//     console.log("Function: getDistance\nLat: " + lat + "\nLon: " + lon + "\nuserLat: " + userLat + "\nuserLon: " + userLon);

//     const dLat = deg2rad(userLat-lat);
//     const dLon = deg2rad(userLon-lon); 
//     const a = 
//       Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(deg2rad(lat)) * Math.cos(deg2rad(userLat)) * 
//       Math.sin(dLon/2) * Math.sin(dLon/2)
//       ; 
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//     const distance = Math.round(R * c);
//     console.log("Distance between your current location and " + city + " is approximately " + distance + " miles.");
//     weatherBank["distance"] = "distance";
//     return distance;
// }

// function deg2rad(deg) {
// return deg * (Math.PI/180)
// }

// function simulateSubmittedCritera() {
//     fillWeatherBank();
//     getCoords(city);
//     getUserLocation();
//     setTimeout(function () {
//         getDistance(userLat, userLon, lat, lon, city);
//     }, 5000); 
// }

// function toTitleCase(str) {
//     return str.replace(/\w\S*/g, function(txt){
//         return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//     });
// }

// simulateSubmitBtn.addEventListener("click", simulateSubmittedCritera);
// fillWeatherBankBtn.addEventListener("click", fillWeatherBank);











////////////////////////////// ASYNC Await Function //////////////////////////////
// function getUserLocation() {
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
//         const position = await getUserLocation();
//         const { userLat, userLon } = await showPosition(position);
//         getDistance(userLat, userLon, lat, lon, city);
//     } catch (error) {
//         console.error("Error:", error);
//     }
// }
////////////////////////////// //////////////// //////////////////////////////