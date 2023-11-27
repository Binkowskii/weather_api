async function getWeather() {
    const inputCity = document.getElementById('city');
    const city = inputCity.value.trim();

    if (city) {
        await getWeatherByCity(city);
    } else {
        const success = await getWeatherByLocation();

        if (!success) {
            alert('Please enter a city name or allow automatic location detection.');
        }
    }
}

async function getWeatherByCity(city) {
    const apiKey = '7921a2a56109c1730ec3517e11740fa1';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            displayWeather(data);
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function getWeatherByLocation() {
    const apiKey = '7921a2a56109c1730ec3517e11740fa1';

    return new Promise((resolve) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
                    const response = await fetch(apiUrl);
                    const data = await response.json();

                    if (response.ok) {
                        displayWeather(data);
                        resolve(true); // Successful automatic location check
                    } else {
                        console.error(`Error: ${data.message}`);
                        resolve(false); // Failed automatic location check
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                    resolve(false); // Failed automatic location check
                }
            );
        } else {
            console.warn('Geolocation is not supported by your browser.');
            resolve(false); // Failed automatic location check
        }
    });
}

function updateStylesForWeather() {
    const body = document.body;
    const container = document.querySelector('.container');

    body.style.animation = 'changeBackgroundColor 0.5s ease-in-out';
    container.style.animation = 'changeBoxShadow 0.3s ease-in-out';
}

function displayWeather(data) {
    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.classList.remove('hidden');

    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${Math.round(data.main.temp - 273.15)}°C</p>
        <p>Description: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
    `;

    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather Icon">`;

    // Update styles based on weather
    updateStylesForWeather();
}

// Use automatic location check on page load
document.addEventListener('DOMContentLoaded', async () => {
    const success = await getWeatherByLocation();

    // If automatic location check fails, display a message or take alternative action
    if (!success) {
        console.warn('Automatic location check failed. Please enter a city manually.');
    }
});
