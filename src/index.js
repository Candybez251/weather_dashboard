// Add an event listener to the form
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-input");
  if (!cityInput.value) {
    alert("Please enter a city name.");
    return;
  }
  fetchWeatherData(cityInput.value);
}

function fetchWeatherData(query) {
  let key = "2eccbcd952a1aceae0d14b25abf53b4a";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${key}&units=metric`;
  axios
    .get(url)
    .then(updateTemperature)
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("Could not retrieve weather data. Please try again.");
    });
}

function updateTemperature(response) {
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = response.data.name;

  let currentDateElement = document.querySelector("#current-date");
  let timeValue = response.data.dt * 1000;
  let date = new Date(timeValue);
  currentDateElement.innerHTML = formatDateTime(date);

  let currentDescription = document.querySelector("#current-description");
  currentDescription.innerHTML = response.data.weather[0].description;

  let currentHumidity = document.querySelector("#current-humidity");
  currentHumidity.innerHTML = `${response.data.main.humidity}%`;

  let currentWindSpeed = document.querySelector("#current-wind");
  currentWindSpeed.innerHTML = `${response.data.wind.speed} km/h`;

  let currentIcon = document.querySelector("#current-icon");
  currentIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" alt="${response.data.weather[0].description}" class="current-temperature-icon" />`;

  let currentTemperature = document.querySelector("#current-temp");
  currentTemperature.innerHTML = Math.round(response.data.main.temp);

  fetchForecast(response.data.name);
}

function fetchForecast(query) {
  let key = "2eccbcd952a1aceae0d14b25abf53b4a";
  let url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${key}&units=metric`;
  axios
    .get(url)
    .then(displayForecast)
    .catch((error) => {
      console.error("Error fetching forecast data:", error);
    });
}

function displayForecast(response) {
  let forecastData = "";
  response.data.list.forEach((item, index) => {
    if (index % 8 === 0) { // OpenWeather forecast returns data every 3 hours, showing daily forecast every 24 hours (8 intervals)
      forecastData += `
        <div class="weather-forecast-data">
          <div class="weather-forecast-day">
            ${formatDay(item.dt)}
          </div>
          <div class="wf-icon">
            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}" class="weather-forecast-icon" />
          </div>
          <div class="weather-forecast-high-low">
            <span class="wf-high">${Math.round(item.main.temp_max)}°</span>
            <span class="wf-low">${Math.round(item.main.temp_min)}°</span>
          </div>
        </div>
      `;
    }
  });

  let currentForecast = document.querySelector("#weather-forecast");
  currentForecast.innerHTML = forecastData;
}

function formatDay(time) {
  let date = new Date(time * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function formatDateTime(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = date.getDay();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let today = days[day];
  return `${today} ${hours}:${minutes}`;
}

// Initial fetch call
fetchWeatherData("Addis Ababa");