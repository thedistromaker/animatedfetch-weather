document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const apiKey = 'YOUR_WEATHERAPI_KEY'; // <-- REPLACE THIS
    const lat = 51.3616; // Replace these with lat and lon - N is positive, S is negative. E.g. 48.3319 deg S is -48.3319
    const lon = -0.1900; // E is positive, W is negative. E.g. 0.7446 deg W is -0.7446
    
    // ** ADDED alerts=yes to the URL **
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&alerts=yes`;

    // --- HTML Elements ---
    const locationNameEl = document.getElementById('location-name');
    const weatherDataEl = document.getElementById('weather-data');
    const weatherIconEl = document.getElementById('weather-icon');
    const weatherAlertsEl = document.getElementById('weather-alerts'); // Get the new alerts div

    /**
     * Maps a WeatherAPI condition code to a Bas Milius animated icon name.
     * @param {number} code - The weather condition code from the API.
     * @param {number} isDay - 1 for day, 0 for night.
     * @returns {string} The filename of the SVG icon.
     */
    function getIconFileName(code, isDay) {
        // (This function remains unchanged from the previous version)
        const iconMap = {
            1000: isDay ? 'clear-day' : 'clear-night', 1003: isDay ? 'partly-cloudy-day' : 'partly-cloudy-night',
            1006: 'cloudy', 1009: 'overcast', 1030: 'mist',
            1063: isDay ? 'partly-cloudy-day-drizzle' : 'partly-cloudy-night-drizzle',
            1066: isDay ? 'partly-cloudy-day-snow' : 'partly-cloudy-night-snow',
            1069: isDay ? 'partly-cloudy-day-sleet' : 'partly-cloudy-night-sleet',
            1072: 'drizzle', 1087: 'thunderstorms', 1114: 'wind-snow', 1117: 'blizzard',
            1135: 'fog', 1147: 'fog', 1150: 'drizzle', 1153: 'drizzle', 1168: 'drizzle',
            1171: 'drizzle', 1180: 'rain', 1183: 'rain', 1186: 'rain', 1189: 'rain',
            1192: 'rain', 1195: 'rain', 1198: 'sleet', 1201: 'sleet', 1204: 'sleet',
            1207: 'sleet', 1210: 'snow', 1213: 'snow', 1216: 'snow', 1219: 'snow',
            1222: 'snow', 1225: 'snow', 1237: 'hail', 1240: 'rain', 1243: 'rain',
            1246: 'rain', 1249: 'sleet', 1252: 'sleet', 1255: 'snow', 1258: 'snow',
            1261: 'hail', 1264: 'hail', 1273: 'thunderstorms-rain', 1276: 'thunderstorms-rain',
            1279: 'thunderstorms-snow', 1282: 'thunderstorms-snow'
        };
        return iconMap[code] || 'not-available';
    }

    if (!apiKey || apiKey === 'YOUR_WEATHERAPI_KEY') {
        locationNameEl.textContent = 'API Key Missing';
        weatherDataEl.innerHTML = `<p>Please add your WeatherAPI.com key to script.js</p>`;
        return;
    }

    // --- Fetch and Display Weather ---
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const location = data.location;
            const current = data.current;

            // 1. **NEW**: Check for and display alerts
            weatherAlertsEl.innerHTML = ''; // Clear any previous alerts
            if (data.alerts && data.alerts.alert.length > 0) {
                data.alerts.alert.forEach(alert => {
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert-item';
                    alertDiv.innerHTML = `
                        <h3>${alert.headline}</h3>
                        <p><strong>Severity:</strong> ${alert.severity}</p>
                        <p><strong>Effective:</strong> ${new Date(alert.effective).toLocaleString()}</p>
                        <p>${alert.desc}</p>
                    `;
                    weatherAlertsEl.appendChild(alertDiv);
                });
            }

            // 2. Update location text
            locationNameEl.textContent = `${location.name}, ${location.country}`;

            // 3. Determine and update the icon
            const iconFileName = getIconFileName(current.condition.code, current.is_day);
            const iconUrl = `https://cdn.jsdelivr.net/gh/basmilius/weather-icons@dev/production/fill/svg/${iconFileName}.svg`;
            weatherIconEl.src = iconUrl;
            weatherIconEl.alt = current.condition.text;

            // 4. Update weather data text
            weatherDataEl.innerHTML = `
                <p><strong>${current.condition.text}</strong></p>
                <p><strong>Temp:</strong> ${current.temp_c}°C</p>
                <p><strong>Feels Like:</strong> ${current.feelslike_c}°C</p>
                <p><strong>Wind:</strong> ${current.wind_kph} km/h</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            locationNameEl.textContent = 'Error';
            weatherDataEl.innerHTML = `<p>Could not load weather data. Please check your API key and network connection.</p>`;
        });
});
