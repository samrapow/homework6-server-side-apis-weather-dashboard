var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
var APIKey = '63b4d64dfe4056a23fee52b7d97ce82d';
var city;
var submitButton = $('.submit-button');
var cityInput = $('.city-input');
var todayWeather = $('.weather-today');
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

    // var card = document.createElement('div');
    // var cardBody = document.createElement('div');
    // var heading = document.createElement('h2');
    // var weatherIcon = document.createElement('img');
    // var temp = document.createElement('p');
    // var wind = document.createElement('p');
    // var humidity = document.createElement('p');
    // var uv = document.createElement('p');
    // var uviChangeColor = document.createElement('button');

    var card = $('<div>');
    var cardBody = $('<div>');
    var heading = $('<h2>');
    var weatherIcon = $('<img>');
    var temp = $('<p>');
    var wind = $('<p>');
    var humidity = $('<p>');
    var uv = $('<p>');
    var uviChangeColor = $('<button>');

    // card.setAttribute('class', 'current-weather-card');
    // cardBody.setAttribute('class', 'current-weather-card-body');
    card.append(cardBody);

    // heading.setAttribute('class', 'h3 card-title');
    // temp.setAttribute('class', 'card-text');
    // wind.setAttribute('class', 'card-text');
    // humidity.setAttribute('class', 'card-text');

    heading.text(`${city} (${date})`);
    weatherIcon.attr('src', iconUrl);
    weatherIcon.attr('alt', iconDescription);
    // weatherIcon.setAttribute('class', 'weather-img');
    heading.append(weatherIcon);
    temp.text(`Temp: ${tempF}°F`);
    wind.text(`Wind: ${windMph} MPH`);
    humidity.text(`Humidity: ${humidity} %`);
    cardBody.append(heading, temp, wind, humidity);

    uv.text('UV Index: ')
    uviChangeColor.addClass('btn', 'btn-sm');

    if (uvi < 3) {
        uviChangeColor.addClass('btn-low');
    } else if (uvi < 7) {
        uviChangeColor.addClass('btn-mid');
    } else {
        uviChangeColor.addClass('btn-high');
    }

    uviChangeColor.text(uvi);
    uv.append(uviChangeColor);
    cardBody.append(uv);

    todayWeather.html('');
    todayWeather.append(card);
}
