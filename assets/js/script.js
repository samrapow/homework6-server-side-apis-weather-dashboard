var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("api.openweathermap.org/data/2.5/weather?q=atlanta&appid=d91f911bcf2c0f925fb6535547a5ddc9", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));