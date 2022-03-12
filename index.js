let sunIcon = '<i class="fa-solid fa-sun sunicon"></i>';
let moonIcon = '<i class="fa-solid fa-moon"></i>';
let locNotFound = 'https://content.spiceworksstatic.com/service.community/p/post_images/0000370037/5d66dc1e/attached_image/location_01.jpg';


document.querySelector("#searchbtn").addEventListener("click", getWeather);


function getWeather(){
    let city = document.querySelector("#city").value;
    document.querySelector("#locationInfo").innerHTML = null;
    document.querySelector("#locationMap").innerHTML = null;
    document.querySelector("#weekForecast").innerHTML = null;
    document.querySelector("#msg").innerHTML = null;
    getCurrentWeather(city);
    // getMap(city);
    getWeekForecast(city);
}


async function getCurrentWeather(city){
    try{
        let fetch_promise = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=07f82d73a01aa9f2320e8b7e6819d70a&units=metric`)
        let weather_data = await fetch_promise.json();
        console.log(weather_data);
        if(weather_data.cod === "404"){
            // No such city found

            let errorImg = document.createElement("img");
            errorImg.src = locNotFound;
            errorImg.style.width = "100%";
            errorImg.style.height = "100%";

            let errorMap = document.createElement("img")
            errorMap.src = "https://www.twca.in/static/core/images/no_map.png";
            errorMap.style.width = "100%";
            errorMap.style.height = "100%"

            //document.getElementById("locationInfo").append(errorImg);
            document.querySelector("#locationMap").append(errorMap);
            document.querySelector("#locationInfo").append(errorImg);
        }
        else{
            showCurrentWeather(weather_data);
        }
    }
    catch(e){
        console.log(`error: ${e}`)
    }
}


// Async Function get weekly forecast

async function getWeekForecast(city){
    try{
        let fetch_promise = await fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=7&appid=07f82d73a01aa9f2320e8b7e6819d70a&units=metric`)
        let forecast_data = await fetch_promise.json();
        console.log(forecast_data);
        if(forecast_data.cod !== "404"){
            showForecast(forecast_data.list, forecast_data.city.name);
        }
    }
    catch(e){
        console.log(`error: ${e}`)
    }
}









/* FUNCTION TO APPEND CURRENT WEATHER DATA & MAP */

function showCurrentWeather(data){
    let loc = document.createElement("h1");
    loc.innerText = `${data.name}, ${data.sys.country}`

    let tempDiv = document.createElement("div");
    tempDiv.setAttribute("class", "mainTemp");
    let temp = document.createElement("h1");
    temp.innerText = `${Math.round(data.main.temp)}°C`;

    // Main Temp Div + Icon
    let icon = document.createElement("img");
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    // icon.style.border = "1px solid blue";

    tempDiv.append(icon, temp);

    let feelsLike = document.createElement("p");
    feelsLike.innerText = `Feels Like ${Math.round(data.main.feels_like)}°C. ${data.weather[0].description}`;
    feelsLike.setAttribute("class", "feelslike")
    // min max temp div
    let minMaxTempDiv = document.createElement("div");
    minMaxTempDiv.setAttribute("class", "minmax");

    let maxTemp = document.createElement("p");
    maxTemp.innerText = `Max Temp: ${Math.round(data.main.temp_max)}°C`;

    let minTemp = document.createElement("p");
    minTemp.innerText = `Min Temp: ${Math.round(data.main.temp_min)}°C`;

    minMaxTempDiv.append(minTemp, maxTemp);

    let sunTimeDiv = document.createElement("div");
    sunTimeDiv.setAttribute("class", "suntime");

    let sunrise = document.createElement("p"); 
    sunrise.innerHTML = `${sunIcon}  ${getNormalTime(data.sys.sunrise)} Hrs`;
    
    let sunset = document.createElement("p");
    sunset.innerHTML = `${moonIcon}  ${getNormalTime(data.sys.sunset)} Hrs`;

    sunTimeDiv.append(sunrise, sunset)

    let otherInfoDiv = document.createElement("div");
    otherInfoDiv.setAttribute("class", "otherinfo");

    let humidity = document.createElement("p");
    humidity.innerHTML = `<b>Humidity:</b> ${data.main.humidity}%`

    let pressure = document.createElement("p");
    pressure.innerHTML = `<b>Pressure:</b> ${data.main.pressure} hPa`;

    let wind = document.createElement("p");
    wind.innerHTML = `<b>Wind Speed:</b> ${data.wind.speed} m/s N`;

    let clouds = document.createElement("p");
    clouds.innerHTML = `<b>Clouds:</b> ${data.clouds.all}%`;

    otherInfoDiv.append(humidity, clouds, pressure, wind);

    
    // console.log(getNormalTime(data.sys.sunrise));
    // console.log(getNormalTime(data.sys.sunset));

    document.querySelector("#locationInfo").append(loc, tempDiv, feelsLike, minMaxTempDiv, sunTimeDiv, otherInfoDiv);



    // Creating map div

    let mapFrame = document.createElement("iframe");
    mapFrame.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyCHp5ZGt0JcuV3VOXN5b7di3cVtL1PETKg&q=${data.name}&zoom=15`;

    document.querySelector("#locationMap").append(mapFrame);
}




// Function to append weekly forecast

function showForecast(data, city){
    console.log("Received data", data);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]

    document.querySelector("#msg").innerText = `Weekly Forecast for ${city}`;

    data.map(function(elem, index){

        let dateobj = new Date(elem.dt * 1000);
        let day = days[dateobj.getDay()];
        let monthName = months[dateobj.getMonth()];
        let date = dateobj.getDate() < 10 ? `0${dateobj.getDate()}` : dateobj.getDate();

        let day_month = `${day}, ${monthName} ${date}`;


        let mainDiv = document.createElement("div");
        mainDiv.setAttribute("class", "weekDayDiv");

        let dayPara = document.createElement("h3");
        dayPara.innerText = day_month;

        let iconDiv = document.createElement("div");
        let weatherIcon = document.createElement("img");
        weatherIcon.src = `https://openweathermap.org/img/wn/${elem.weather[0].icon}@2x.png`;
        iconDiv.append(weatherIcon);

        let maxTemp = document.createElement("p");
        maxTemp.innerText = `Max: ${Math.round(elem.temp.max)}°C`

        let minTemp = document.createElement("p");
        minTemp.innerText = `Min: ${Math.round(elem.temp.min)}°C`

        mainDiv.append(dayPara, iconDiv, maxTemp, minTemp);

        document.querySelector("#weekForecast").append(mainDiv);

    })
    // Appending Main Part
    
    // console.log(day)
    // console.log("date is", date);
    // data.map(function(elem, index){
    //     let mainDiv = document.createElement("div");
        
        
    // })
}




/* FUNCTION TO CONVERT UNIX TIMESTAMP TO NORMAL TIME */

function getNormalTime(timestamp){
    let date = new Date(timestamp*1000);

    // If hours or mins less than 0, concatenate 0 before to look it more readable//
    let hours = (date.getHours() < 10) ? `0${date.getHours()}`: date.getHours();
    let mins = (date.getMinutes() < 10) ? `0${date.getMinutes()}`: date.getMinutes();
    
    return `${hours}:${mins}`;

}


// function getMapSource(city){

// }