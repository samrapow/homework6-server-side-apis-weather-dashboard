var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
var APIKey = '63b4d64dfe4056a23fee52b7d97ce82d';
var city;
var submitButton = $('.submit-button');
var cityInput = $('.city-input');
var todayWeather = document.querySelector('.weather-today');
var url;

  


// Wait for submit button to be clicked
submitButton.on("click", grabCity);

// Get City input so that I can get the coordinates
function grabCity(x) {
    // see if there's anything submitted
    if (!cityInput.val()) {
        return;
    }
    x.preventDefault();
    city = cityInput.val();
    getCoordinates(city);
}


// Get city coordinates
function getCoordinates(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!data[0]) {
                alert('Location not found');
            } else {
                // console.log("works");
                // addCityToHistory(city);
                console.log(data[0]);
                console.log(data[0].lat)
                getWeather(data[0]);
            }
        })
        .catch(function (err) {
            console.error(err);
        });
}

// Get weather data
function getWeather(place) {
    var lat = place.lat;
    var lon = place.lon;
    var city = place.name;

    url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=" + APIKey;
    console.log(url);
    fetch(url)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            showWeather(city, data);
        })
        .catch(function (err) {
            console.error(err);
        });
}

// Show weather
function showWeather(city, data) {
    showCurrentWeather(city, data.current, data.timezone);
    // showFutureWeather(data.daily, data.timezone);
}

// Show current weather
function showCurrentWeather(city, weather, timezone) {
    
    var date = moment().format("dddd, MMMM Do")

    // Store response data from our fetch request in variables
    var tempF = weather.temp;
    var windMph = weather.wind_speed;
    var humidity = weather.humidity;
    var uvi = weather.uvi;
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    var iconDescription = weather.weather[0].description || weather[0].main;

    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var heading = document.createElement('h2');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var uvEl = document.createElement('p');
    var uviBadge = document.createElement('button');

    // card.setAttribute('class', 'current-weather-card');
    // cardBody.setAttribute('class', 'current-weather-card-body');
    card.append(cardBody);

    // heading.setAttribute('class', 'h3 card-title');
    // tempEl.setAttribute('class', 'card-text');
    // windEl.setAttribute('class', 'card-text');
    // humidityEl.setAttribute('class', 'card-text');

    heading.textContent = `${city} (${date})`;
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    // weatherIcon.setAttribute('class', 'weather-img');
    heading.append(weatherIcon);
    tempEl.textContent = `Temp: ${tempF}°F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    cardBody.append(heading, tempEl, windEl, humidityEl);

    uvEl.textContent = 'UV Index: ';
    uviBadge.classList.add('btn', 'btn-sm');

    if (uvi < 3) {
        uviBadge.classList.add('btn-success');
    } else if (uvi < 7) {
        uviBadge.classList.add('btn-warning');
    } else {
        uviBadge.classList.add('btn-danger');
    }

    uviBadge.textContent = uvi;
    uvEl.append(uviBadge);
    cardBody.append(uvEl);

    todayWeather.innerHTML = '';
    todayWeather.append(card);
}
