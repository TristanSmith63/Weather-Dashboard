document.getElementById('searchBtn').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        fetchWeatherData(city);
    }
});

function fetchWeatherData(city) {
    const apiKey = '492218b0f36a725ff9969166ef0100b6'; // Replace with your actual API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    // Fetch current weather
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => updateCurrentWeather(data))
        .catch(error => console.error('Fetching current weather failed:', error));

    // Fetch 5-day forecast
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => updateForecast(data))
        .catch(error => console.error('Fetching forecast failed:', error));
}

function updateCurrentWeather(data) {
    const weatherDetails = document.getElementById('weather-details');
    weatherDetails.innerHTML = `<p><strong>Temperature:</strong> ${data.main.temp}°F</p>
                                <p><strong>Wind:</strong> ${data.wind.speed} MPH</p>
                                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>`;
}

function updateForecast(data) {
    const forecastDetails = document.getElementById('forecast-details');
    forecastDetails.innerHTML = ''; // Clear previous entries
    // Loop through forecast data and create HTML for each day
    for (let i = 0; i < data.list.length; i += 8) { // data.list contains forecast for every 3 hours
        const dayData = data.list[i];
        const dayElem = document.createElement('div');
        dayElem.classList.add('forecast-day');
        dayElem.innerHTML = `<p><strong>${new Date(dayData.dt_txt).toLocaleDateString()}</strong></p>
                             <p>Temp: ${dayData.main.temp}°F</p>
                             <p>Wind: ${dayData.wind.speed} MPH</p>
                             <p>Humidity: ${dayData.main.humidity}%</p>`;
        forecastDetails.appendChild(dayElem);
    }
}
