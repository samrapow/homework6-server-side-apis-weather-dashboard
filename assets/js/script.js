var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
var APIKey = '63b4d64dfe4056a23fee52b7d97ce82d';
var city;
var submitButton = $('.submit-button');
var cityInput = $('.city-input');

  


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
    cityInput.val() = '';
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
                addCityToHistory(city);
                getWeather(data[0]);
            }
        })
        .catch(function (err) {
            console.error(err);
        });
}

// Get weather 
