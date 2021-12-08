var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
var APIKey = '63b4d64dfe4056a23fee52b7d97ce82d';
var city;
  
  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

