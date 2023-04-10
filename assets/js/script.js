// API Keys:
let OpenWeatherAPIKey = "fe8c1985df685a70d00e6d5098ec6a2d";

// Global Vars
let lat;
let lon;
let userLat;
let userLon;

const tempRangeEl = document.querySelector("#tempRange");
const windRangeEl = document.querySelector("#windRange");
const conditionsEl = document.querySelector("#conditions");
const drivingRangeEl = document.querySelector("#drivingRange");
const submitBtn = document.querySelector("#submitButton");
const cityContainerEl = document.querySelector("#citiesContainer");
const clearStorageBtn = document.querySelector("#simulate-submit");
const fillWeatherBankBtn = document.querySelector("#fill-weatherBank");


// Navbar selections
const getAwayEl = document.querySelector("#getAway");
const aboutTheTeamEl = document.querySelector("#aboutTheTeam");
const aboutTheProjectEl = document.querySelector("#aboutTheProject");

// initialize the display properties such that the "About the Project" page shows first
// aboutTheProjectEl.style.display = "flex";
// aboutTheTeamEl.style.display = "none";
// getAwayEl.style.display = "none";

// // when "About the Team" is clicked, hide the about the project and get away sections
// aboutTheTeamEl.addEventListener("click", function (event) {
//     event.preventDefault();
//     aboutTheProjectEl.style.display = "none";
//     getAwayEl.style.display = "none";
//     aboutTheTeamEl.style.display = "flex"
// })

// // when Get Away! link is clicked, show the usual functionality of the webpage (loading screen, dropdowns, city return after run)
// getAwayEl.addEventListener("click", function (event) {
//     event.preventDefault();
//     aboutTheTeamEl.style.display = "none";
//     aboutTheProjectEl.style.display = "none";
//     getAwayEl.style.display = "flex";
// })

// predefined bank of cities to be used to fill weather data in the weatherBank
// extended weatherBank (more results, takes longer to load):
let MVPcityBank = ["Tulsa", "New York", "Los Angeles", "Philadelphia", "Salt Lake City", "Las Vegas", "Denver", "Kalispell", "Seattle", "Austin", "Cheyenne", "Miami", 
 "Grand Rapids", "Albuquerque", "Phoenix", "Portland", "Eugene", "Flagstaff", "Cedar City", "Buffalo", "Billings", "Idaho Falls", "Atlanta", 
 "Miami", "Charlotte", "Houston", "Fargo", "Chicago", "San Antonio", "San Diego", "Dallas", "Austin", "Jacksonville", "Fort Worth", "San Jose", "Columbus", "Indianapolis", 
 "San Fransisco", "Oklahoma City", "El Paso", "Nashville", "Memphis", "Louisville", "Detroit", "Boston", "Baltimore", "Milwaukee"]
;

// abridged weatherBank (less results, loads more quickly):
// let MVPcityBank = ["Tulsa", "New York", "Los Angeles", "Philadelphia", "Salt Lake City", "Las Vegas", "Denver", "Kalispell", "Seattle", "Austin", "Cheyenne", "Miami", 
// "Grand Rapids", "Albuquerque", "Phoenix", "Portland", "Eugene", "Flagstaff", "Cedar City"];

// initialize weatherBank as an empty array
let weatherBank = [];

// on first page visit, when page loads, fill the weatherbank
window.onload = function () {
    if (!localStorage.getItem("weatherBank")) {
        // run fill function if local storage is empty
        fillWeatherBank();
    }
}

// fills the weatherbank for predefined bank of cities
function fillWeatherBank() {
    // clear local storage so fillWeatherBank button can serve as a reset
    localStorage.clear();
    // loading bar
    move();

    // get user's current location (coordinates: userLat, userLon)
    getUserLocation().then(() => {
        // then wait one second allowing extra time for getUserLocation to run
        // async function awaits a resolution from getUserLocation before allowing the rest of the functionality to run
        setTimeout(async function () {
            // for each city in the cityBank
            for (const city of MVPcityBank) {
                // get city coordinates
                await getCoords(city);
                // calculate distance between user and each city
                const distance = getDistance(userLat, userLon, lat, lon, city);
                // get weather for each city and fill the weatherBank
                await getForecast(lat, lon, city, distance);
            }
            // set the weatherbank in local storage so user does not have to re-run every time
            localStorage.setItem("weatherBank", JSON.stringify(weatherBank));
            // console log for testing purposes
            console.log("Weather Bank: ");
            console.log(weatherBank);
            // return the weatherbank
            return weatherBank;

        }, 5000);
    }); 

}

// loading bar functionality
function move() {
    var i = 0; // this is the counter
    if (i == 0) { 
        i = 1; 
        var elem = document.getElementById("myBar"); // this is the progress bar element
        var width = 1;
        var id = setInterval(frame, 200); // this is the speed of the progress bar
        function frame() { 
            if (width >= 100) { // this is the length of the progress bar
                clearInterval(id);
                i = 0; 
            } else { 
                width++;
                elem.style.width = width + "%";
                elem.innerHTML = width * 1 + "%";
                }
                if (width == 100) {
                 document.getElementById("myProgress").style.display = "none";
                 document.getElementById("myBar").style.display = "none";
                 //document.getElementById("citeriaSelection").style.display="block";
              }
        }
    }

// get the current location of the user
function getUserLocation() {
    // return a resolved or rejection promise depending on outcome of function
    return new Promise((resolve, reject) => {
        // if coordinates are returned, promise is resolved
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                userLat = parseFloat(position.coords.latitude);
                userLon = parseFloat(position.coords.longitude);
                // console.log("Function: showPosition\nuserLat: " + userLat + "\nuserLon: " + userLon);
                resolve();
            });
        // otherwise, return a rejection
        } else {
            reject('Geolocation may not be supported by this browser. Please ensure Location Access is set to "Allowed"');
        }
    });
}

// get coordinates for each city in the city bank
async function getCoords(city) {
    // plug city name and API key into API request URL
    const geoURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + OpenWeatherAPIKey;
    // fetch geo data
    const response = await fetch(geoURL);
    const geoData = await response.json();

    // store latitude and longitude values, parseFloat because rounding will give incorrect locations
    lat = parseFloat(geoData.coord.lat);
    lon = parseFloat(geoData.coord.lon);
}

// use the Haversine formula to calculate the distance between the user and the current city
function getDistance(userLat, userLon, lat, lon, city, weatherBank) {
    // radius of the earth in miles
    const R = 3958.8; 

    // convert degrees to radians
    const dLat = deg2rad(userLat-lat);
    const dLon = deg2rad(userLon-lon); 
    // calculate the square of 1/2 the chord length between both locations
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat)) * Math.cos(deg2rad(userLat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    // calculate the angular distance in radians between the two locations
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

    // calculate distance in miles and round the value
    const distance = Math.round(R * c);


    // console log for testing purpose
    console.log("Distance between your current location and " + city + " is approximately " + distance + " miles.");

    // return the distance
    return distance;
}

// degree to radians conversion function
function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

// get the weather forecast for each city using lat, lon, and API key in URL
async function getForecast(lat, lon, city, distance) {
    let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + OpenWeatherAPIKey + "&units=imperial";
    // fetch forecast data
    const response = await fetch(forecastURL);
    const forecastData = await response.json();
    
    // for easier sorting of cities, tempSetting is set as an empty string to be filled below
    let tempSetting = '';

    // if temp is above 80, it is "hot"
    if (forecastData.list[0].main.temp > 80) {
        tempSetting = "hot";
    }
    // if temp is below 50, it is "cold"
    else if (forecastData.list[0].main.temp < 50) {
        tempSetting = "cold";
    }
    // otherwise, the temp is between 50 and 80 and it is "moderate"
    else {
        tempSetting = "moderate";
    }

    // similarly, for easier sorting of cities by distance, distanceSetting is set as an empty string to be filled below
    let distanceSetting = '';

    // if distance is above 500, it is "far"
    if (distance > 500) {
        distanceSetting = "far";
    }
    // if distance is below 100, it is "close"
    else if (distance < 100) {
        distanceSetting = "close";
    }
    // otherwise, the distance is between 100 and 500 and it is "medium"
    else {
        distanceSetting = "medium";
    }

    // create the weather object for each city we will be storing in the weatherBank array
    // inside are all the key-value pairs needed for adequate sorting of cities and return of desired  weather data
    let weather = {
        city: forecastData.city.name,
        icon: "https://openweathermap.org/img/wn/" + forecastData.list[0].weather[0].icon + "@2x.png",
        // again, tempSetting simply defines "hot", "moderate", or "cold" for sorting purposes
        temperatureSetting: tempSetting,
        // tempVal on the other hand is used to push the actual temperature value to the user
        temperatureVal: forecastData.list[0].main.temp,
        // the same philosophy applies to wind. it is either low or high for easier sorting
        windSetting: forecastData.list[0].wind.speed < 10 ? "low" : "high",
        // windVal is used to display the actual wind speed value to the user
        windVal: forecastData.list[0].wind.speed, 
        // weather description (ie. cloudy, clear, snow, etc.)
        weather: forecastData.list[0].weather[0].main,
        // distanceSetting is either far, medium, or close
        distanceSetting: distanceSetting,
        // distanceVal is the actual distance in miles
        distanceVal: distance
    };
    // push the weather objects for each city into the weatherBank array
    weatherBank.push(weather);
}

// now that the weatherBank is filled, the "Get Cities!" button triggers checkCities to begin looking for cities that match the user's criteria
function checkCities(weatherBank) {
    // first, get the weatherbank from local storage, set it to weatherBank
    weatherBank = JSON.parse(localStorage.getItem("weatherBank"));
    // returnedCities will be a new array containing only filtered/sorted cities that match user criteria. Set it as a blank array for initialization
    let returnedCities = [];
    // every time "Get Cities!" button is clicked, I want to clear the array and reset the container element 
    returnedCities.length = 0;
    cityContainerEl.innerHTML = "";
    // take in user-selected criteria below (temp, wind, conditions, and range)
    let userTemperature = tempRangeEl.value;
    let userWind = windRangeEl.value;
    let userConditions = conditionsEl.value;
    let userRange = drivingRangeEl.value;

    // if the user fails to enter any of the required criteria, alert them to which criteria was left blank and must be filled
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

    // loop through the weatherBank
    for (let i = 0; i < weatherBank.length; i++) {
        // for simplicities' sake, were calling city the current index of weatherbank
        let city = weatherBank[i];
        // set the acceptance criteria for the indexed city to "true"
        let isMatch = true;


        // now, we send each city through the 'gauntlet' of pass/fail criteria. Only cities that emerge at the end with a match value of true will be accepted into returnedCities
        // check if the temperature is within range by comparing the user specified value to each possible of weather values
        // if any of these are true, the match value is false and it fails the gauntlet
        if (userTemperature === "hot" && (city.temperatureSetting === "moderate" || city.temperatureSetting === "cold")) {
            isMatch = false;
        } else if (userTemperature === "moderate" && (city.temperatureSetting === "hot" || city.temperatureSetting === "cold")) {
            isMatch = false;
        } else if (userTemperature === "cold" && (city.temperatureSetting === "hot" || city.temperatureSetting === "moderate")) {
            isMatch = false;
        }
        
        // check if the wind is within range - same philosphy as temperature above
        if (userWind === "low" && city.windSetting === "high") {
          isMatch = false;
        } else if (userWind === "high" && city.windSetting === "low") {
          isMatch = false;
        }

        // check if the weather conditions match
        if (userConditions !== "" && city.weather !== userConditions) {
            isMatch = false;
        }

        // distance filtering wasn't working in a previous attempt so I re-wrote it to work identically to how temperature is sorted.
        if (userRange === "far" && (city.distanceSetting === "medium" || city.distanceSetting === "close")) {
            isMatch = false;
        } else if (userRange === "medium" && (city.distanceSetting === "far" || city.distanceSetting === "close")) {
            isMatch = false;
        } else if (userRange === "close" && (city.distanceSetting === "far" || city.distanceSetting === "medium")) {
            isMatch = false;
        }
        
        // if the cities made it to the end of the gauntlet while maitaining a match value of true, then it is worthy of being pushed to returnedCities
        if (isMatch) {
            returnedCities.push(city);
        }
    }

    // sort returned cities in ascending order based on distance because that is what logically makes sense
    returnedCities.sort((a, b) => a.distanceVal - b.distanceVal);
    // console log for testing and validaiton purposes
    console.log("Cities matching your criteria are:")
    console.log(returnedCities);

    // run display cities to show the user the returned cities
    displayCities(returnedCities)
}


// displayCities takes any and all cities that made it into returnedCities and shows them to the user via a tempalte literal
function displayCities(returnedCities){
    // first, initialize the weatherTemplate template literal
    let weatherTemplate = ``;

    // for each city in the returnedCities array
    for (let i = 0; i < returnedCities.length; i++){
        // again, let city = returnedCities' index for simplicity
        let city = returnedCities[i];

        // here we create and initialize all values the user would want to see
        let setCity = city.city;
        let setDistance = city.distanceVal;
        let setIcon = city.icon;
        let setConditions = city.weather;
        let setTemp = city.temperatureVal;
        let setWind = city.windVal;

        
        // build the template literal
        weatherTemplate += `
        <div id="cityCard">
            <h3>${setCity}</h3>
            <h4>${setDistance} miles away</h4>
            <h5><img src = "${setIcon}"> ${setConditions}</h5>
            <ul id = "weatherList">
                <li>Temperature: ${setTemp}&#8457;</li>
                <li>Wind: ${setWind} mph</li> 
            </ul>
        </div>`;

        // set the innerHTML of the parent containiner "cityContainerEl" to the filled template literal for each city in returnedCities as it loops
        cityContainerEl.innerHTML = weatherTemplate;
    }
}

// event listeners to run functionality 
fillWeatherBankBtn.addEventListener("click", fillWeatherBank);
submitBtn.addEventListener("click", checkCities);

// simple function to clear local storage both for testing purposes and for ease of use
function clearStorage() {
    localStorage.clear();
}
}
