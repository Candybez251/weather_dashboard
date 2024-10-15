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
  let key = "c4o70eae80t53b1a673cb5f833ce0004";
  let url = `https://api.shecodes.io/weather/v1/current?query=${query}&key=${key}&units=metric`;
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
  currentCity.innerHTML = response.data.city;

  let currentDateElement = document.querySelector("#current-date");
  let timeValue = response.data.time * 1000;
  let date = new Date(timeValue);
  currentDateElement.innerHTML = formatDateTime(date);

  let currentDescription = document.querySelector("#current-description");
  currentDescription.innerHTML = response.data.condition.description;

  let currentHumidity = document.querySelector("#current-humidity");
  currentHumidity.innerHTML = `${response.data.temperature.humidity}%`;

  let currentWindSpeed = document.querySelector("#current-wind");
  currentWindSpeed.innerHTML = `${response.data.wind.speed} km/h`;

  let currentIcon = document.querySelector("#current-icon");
  currentIcon.innerHTML = `<img src="${response.data.condition.icon_url}" alt="${response.data.condition.icon}" class="current-temperature-icon" />`;

  let currentTemperature = document.querySelector("#current-temp");
  currentTemperature.innerHTML = Math.round(response.data.temperature.current);

  fetchForecast(response.data.city);
}

function fetchForecast(query) {
  let key = "c4o70eae80t53b1a673cb5f833ce0004";
  let url = `https://api.shecodes.io/weather/v1/forecast?query=${query}&key=${key}&units=metric`;
  axios
    .get(url)
    .then(displayForecast)
    .catch((error) => {
      console.error("Error fetching forecast data:", error);
    });
}

function displayForecast(response) {
  let forecastData = "";
  response.data.daily.forEach((item, index) => {
    if (index < 7) {
      forecastData += `
        <div class="weather-forecast-data">
          <div class="weather-forecast-day">
            ${formatDay(item.time)}
          </div>
          <div class="wf-icon">
            <img src="${item.condition.icon_url}" alt="${
        item.condition.icon
      }" class="weather-forecast-icon" />
          </div>
          <div class="weather-forecast-high-low">
            <span class="wf-high">${Math.round(
              item.temperature.maximum
            )}°</span>
            <span class="wf-low">${Math.round(item.temperature.minimum)}°</span>
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