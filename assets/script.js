var key = '49e7b0dde4bb21e66c57c76ae13e4b9f'
var searchButn = document.querySelector('#search-btn')
var currentWeatherEl = document.querySelector('#current-weather')
var fiveDay = document.querySelector('#fiveDay')
var wind = document.querySelector('.wind')
var humidity = document.querySelector('.humidity')

function checkLocalStorage() {
  const lastCity = localStorage.getItem('lastSearch')
  const buttonEl = document.createElement('button')
  buttonEl.textContent = lastCity
  buttonEl.addEventListener('click', function () {
    getWeather(lastCity)
  })
  buttonEl.classList.add('btn')

  document.getElementById('search-history').appendChild(buttonEl)
  console.log(lastCity)
}
checkLocalStorage()

function clearHistroyDiv() {
  document.getElementById('search-history').innerHTML = ''
}

function getWeather(cityName) {
  const allSearches = JSON.parse(localStorage.getItem('city')) || []

  localStorage.setItem('lastSearch', cityName)
  localStorage.setItem(
    'city', 
    JSON.stringify(
        ...allSearches,
        cityName, 
    )
  )
  clearHistroyDiv() /
  checkLocalStorage()

  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}&units=imperial`
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      currentWeatherEl.innerHTML = `<h3 id="title">${data.name}</h3>
        <p>Temp: ${data.main.temp}</p>
        <p>Wind: ${data.wind.speed}</p>
        <p>Humidity: ${data.main.humidity}</p>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>`

      var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${key}&units=imperial`
      fetch(url)
        .then((response) => response.json())
        .then((fiveDay) => {
          $('#fiveDay').empty()
          console.log(fiveDay.list.length)
          for (var i = 3; i < fiveDay.list.length; i += 8) {
            console.log(fiveDay.list[i])
            var card = document.createElement('div')
            card.classList.add('col-sm-2')

            var content = `
                <div class="card border-dark">
                    <div id="dayOne" class="card-body">
                        <h5 class="card-title">${fiveDay.list[i].dt_txt}</h5>
                        <p class="temp">Temp: ${fiveDay.list[i].main.temp}</p>
                        <p class="wind">Wind: ${fiveDay.list[i].wind.speed}</p>
                        <p class="humidity">Humidity: ${fiveDay.list[i].main.humidity}</p>
                        <img src="http://openweathermap.org/img/wn/${fiveDay.list[i].weather[0].icon}@2x.png"/>
                        
                    </div>
                </div>`
            card.innerHTML = content
            fiveDayEl.appendChild(card)
          }
        })
    })
}
searchButn.addEventListener('click', (event) => {
  var searchCity = document.querySelector('#search-city')
  getWeather(searchCity.value)
})