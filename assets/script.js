document.getElementById("searchBtn").addEventListener("click", function () {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    fetchWeatherData(city);
    saveSearchHistory(city);
  }
});

function fetchWeatherData(city) {
  const apiKey = "492218b0f36a725ff9969166ef0100b6"; // API key
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=imperial`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=imperial`;

  // Fetch current weather
  fetch(weatherUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Weather data fetch failed: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      updateCurrentWeather(data);
      saveSearchHistory(city); // Save the city to the search history
    })
    .catch((error) => console.error("Fetching current weather failed:", error));

  // Fetch 5-day forecast
  fetch(forecastUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Forecast data fetch failed: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => updateForecast(data))
    .catch((error) => console.error("Fetching forecast failed:", error));
}

function updateCurrentWeather(data) {
  const weatherDetails = document.getElementById("weather-details");
  const date = new Date(data.dt * 1000).toLocaleDateString();
  const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  weatherDetails.innerHTML = `<h3>${data.name} (${date})</h3>
                                <img src="${iconUrl}" alt="${data.weather[0].description}">
                                <p><strong>Temperature:</strong> ${data.main.temp}°F</p>
                                <p><strong>Wind:</strong> ${data.wind.speed} MPH</p>
                                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>`;
}

function updateForecast(data) {
  const forecastDetails = document.getElementById("forecast-details");
  forecastDetails.innerHTML = ""; // Clear previous entries

  // Process 5-day forecast
  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000).toLocaleDateString();
    const iconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

    const forecastElem = document.createElement("div");
    forecastElem.classList.add("forecast-day");
    forecastElem.innerHTML = `<p><strong>${date}</strong></p>
                                  <img src="${iconUrl}" alt="${forecast.weather[0].description}">
                                  <p>Temp: ${forecast.main.temp}°F</p>
                                  <p>Wind: ${forecast.wind.speed} MPH</p>
                                  <p>Humidity: ${forecast.main.humidity}%</p>`;
    forecastDetails.appendChild(forecastElem);
  }
}

function saveSearchHistory(city) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!history.includes(city)) {
    history.unshift(city); // Add to the front of the history array
    history = history.slice(0, 8); // Limit history to 8 entries
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }
  updateSearchHistory();
}

function updateSearchHistory() {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  const historyContainer = document.getElementById("search-history");
  historyContainer.innerHTML = ""; // Clear current history

  history.forEach((city) => {
    const cityElem = document.createElement("button");
    cityElem.textContent = city;
    cityElem.addEventListener("click", () => {
      document.getElementById("cityInput").value = city; 
      fetchWeatherData(city);
    });
    historyContainer.appendChild(cityElem);
  });
}

// Initialize the search history on page load
document.addEventListener("DOMContentLoaded", updateSearchHistory);
