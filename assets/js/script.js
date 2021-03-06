var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
var APIKey = '63b4d64dfe4056a23fee52b7d97ce82d';
var city;
var submitButton = $('.submit-button');
var cityInput = $('.city-input');
var todayWeather = $('.weather-today');
var futureWeather = $('.forecast');
var url;

  
// Add timezone plugins to day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

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
                alert('Can not find location!');
            } else {
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
    showFutureWeather(data.daily, data.timezone);
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

    var card = $('<div>');
    var cardBody = $('<div>');
    var heading = $('<h2>');
    var wind = $('<p>');
    var humidity = $('<p>');
    var uv = $('<p>');
    var uviChangeColor = $('<button>');
    var weatherPicture = $('<img>');
    var temp = $('<p>');

    card.append(cardBody);


    heading.text(`${city} (${date})`);
    weatherPicture.attr('src', iconUrl);
    weatherPicture.attr('alt', iconDescription);
    heading.append(weatherPicture);
    temp.text(`Temp: ${tempF}??F`);
    wind.text(`Wind: ${windMph} MPH`);
    humidity.text(`Humidity: ${humidity} %`);
    cardBody.append(heading, temp, wind, humidity);

    uv.text('UV Index: ')
    uviChangeColor.addClass('btn', 'btn-sm');

    // get uvi button to change color depending on uv index level
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

// get future weather
function showFutureWeather(forecast, timezone) {
    var beginDt = dayjs().tz(timezone).add(1, 'day').startOf('day').unix();
    var endDt = dayjs().tz(timezone).add(6, 'day').startOf('day').unix();

    var heading = $('<h4>');
    var headingCol = $('<div>');
    

    heading.text('Five-Day Forecast:');
    headingCol.append(heading);

    futureWeather.html('');
    futureWeather.append(headingCol);
    for (var i = 0; i < forecast.length; i++) {
        if (forecast[i].dt >= beginDt && forecast[i].dt < endDt) {
        showFutureWeatherCard(forecast[i], timezone);
        }
    }
}

// Create card for future weather
function showFutureWeatherCard(forecast, timezone) {
    var forecastDateTime = forecast.dt;
    var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var iconDescription = forecast.weather[0].description;
    var tempF = forecast.temp.day;
    var humidity = forecast.humidity;
    console.log(humidity);
    var windMph = forecast.wind_speed;


    var col = $('<div>');
    var card = $('<div>');
    var cardBody = $('<div>');
    var cardTitle = $('<h5>');
    var humidity = $('<p>');
    var temp = $('<p>');
    var wind = $('<p>');
    var weatherPicture = $('<img>');

    

    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, weatherPicture, temp, wind);

    cardTitle.text(dayjs.unix(forecastDateTime).tz(timezone).format('M/D/YYYY'));
    weatherPicture.attr('src', iconUrl);
    weatherPicture.attr('alt', iconDescription);
    temp.text(`Temp: ${tempF} ??F`);
    wind.text(`Wind: ${windMph} MPH`);
    humidity.text(`Humidity: ${humidity} %`);

    futureWeather.append(col);
}
