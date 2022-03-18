let sunIcon = '<i class="fa-solid fa-sun sunicon"></i>';
let moonIcon = '<i class="fa-solid fa-moon"></i>';
let locNotFound = 'https://content.spiceworksstatic.com/service.community/p/post_images/0000370037/5d66dc1e/attached_image/location_01.jpg';

const backgrounds = {
    thunderstorm: "https://img.freepik.com/free-photo/beautiful-shot-lightning-strike-zagreb-croatia_181624-13398.jpg?w=1380&t=st=1647541315~exp=1647541915~hmac=c1d55ed0756b0f87c4b66ee1d3141d5f43bc686c01c6ee60f2095c73bc3278f4",
    clearsky: "https://www.metoffice.gov.uk/binaries/content/gallery/metofficegovuk/hero-images/weather/cloud/cumulus-cloud.jpg",
    rain: "https://st2.depositphotos.com/2288675/8941/i/950/depositphotos_89412584-stock-photo-rain-drops-falling-on-umbrella.jpg",
    snow: "https://www.lrt.lt/img/2021/12/21/1159298-813911-1287x836.jpg",
    drizzle: "https://thumbs.dreamstime.com/z/raindrops-windshield-rainy-day-stopped-traffic-light-san-francisco-bay-area-california-raindrops-135816754.jpg",
    overcast: "https://cdn.pixabay.com/photo/2013/11/12/20/46/clouds-209704_960_720.jpg",
    others: "https://thumbs.dreamstime.com/z/mountain-haze-1079687.jpg",
}

const container = document.querySelector("#container");

document.querySelector("#city").addEventListener("keyup", function enterPressed(event){
    event.preventDefault();
    if(event.keyCode === 13){
        getWeather();
    }
})



document.querySelector("#searchbtn").addEventListener("click", getWeather);


/*Function to display welcome text*/
const text = "Welcome to this weather application. Here you can search the current weather information and the weekly forecast for any city.";
let i=0;

let welcomeText = document.querySelector("#welcomeText");

window.onload = function typewriter(){
    if(i<text.length){
        welcomeText.textContent += text[i];
        i++;
        setTimeout(typewriter, 75);
    }
}


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



function changeBackground(code){
    let id = code.toString()[0];
    // console.log("id is ", id, typeof(code));
    let bg = "";
    switch(id){
        case "2":{
            bg = backgrounds.thunderstorm;
            break;
        }
        case "3":{
            bg = backgrounds.drizzle;
            break;
        }
        case "5":{
            bg = backgrounds.rain;
            break;
        }
        case "6":{
            bg = backgrounds.snow;
            break;
        }
        case "8":{
            bg = backgrounds.clearsky;
            break;
        }
        default:{
            bg = backgrounds.others;
            break;
        }
    }

    if(code === 804){
        bg = backgrounds.overcast;
    }

    container.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${bg})`;
}





/* FUNCTION TO APPEND CURRENT WEATHER DATA & MAP */

function showCurrentWeather(data){
    welcomeText.remove();
    container.style.display = "block";

    // Changing background image as per weather code
    changeBackground(data.weather[0].id);
    
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










///  SCRIPT TO GET LOCATION OF USER

/*

<div id="location"></div>
    <script>
      var div  = document.getElementById("location");
      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
          div.innerHTML = "The Browser Does not Support Geolocation";
        }
      }

      function showPosition(position) {
        div.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
      }

      function showError(error) {
        if(error.PERMISSION_DENIED){
            div.innerHTML = "The User have denied the request for Geolocation.";
        }
      }
      getLocation();
    </script>

*/