
let currentWeather = null;
let requestId = 0;

// live weather
function getWeather() {

  let thisRequest = ++requestId;

  // Get selected city
  let city = document.getElementById("city");
  let coords = city.value.split(",");

  let lat = coords[0];
  let lon = coords[1];

  // Weather API
  let url = "https://api.open-meteo.com/v1/forecast" +
    "?latitude=" + lat +
    "&longitude=" + lon +
    "&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code";

  currentWeather = null;

  document.getElementById("description").innerText = "Loading...";
  document.getElementById("outsideResult").innerText =
    "Click the button to find out!";
  document.getElementById("outsideResult").style.background =
    "rgba(255, 255, 255, 0.15)";

  // Fetch data from API
  fetch(url)
    .then(function(response) {

      if (!response.ok) {
        throw new Error("Weather request failed");
      }

      return response.json();

    })

    .then(function(data) {

      if (thisRequest !== requestId) {
        return;
      }

      // Read JSON data
      let temp = data.current.temperature_2m;
      let wind = data.current.wind_speed_10m;
      let humidity = data.current.relative_humidity_2m;
      let code = data.current.weather_code;

      // Save weather data for activity checker
      currentWeather = {
        temp: temp,
        wind: wind,
        code: code
      };

      // Update webpage
      document.getElementById("temperature").innerText =
        temp + "°C";

      document.getElementById("wind").innerText = wind;

      document.getElementById("humidity").innerText =
        humidity;

      // Change background based on weather
      if (code === 0 || code === 1) {

        document.body.style.background = "#87ceeb";
        document.getElementById("icon").innerText = "☀️";
        document.getElementById("description").innerText =
          "Sunny";
        document.getElementById("message").innerText =
          "A great day to go outside!";

      } else if (
        (code >= 71 && code <= 77) ||
        (code >= 85 && code <= 86)
      ) {

        document.body.style.background = "#9dbdd2";
        document.getElementById("icon").innerText = "❄️";
        document.getElementById("description").innerText =
          "Snowy";
        document.getElementById("message").innerText =
          "Stay warm today!";

      } else if (
        (code >= 51 && code <= 67) ||
        (code >= 80 && code <= 82) ||
        code >= 95
      ) {

        document.body.style.background = "#466b91";
        document.getElementById("icon").innerText = "🌧️";
        document.getElementById("description").innerText =
          "Rainy or Stormy";
        document.getElementById("message").innerText =
          "A good day to stay inside!";

      } else {

        document.body.style.background = "#778899";
        document.getElementById("icon").innerText = "☁️";
        document.getElementById("description").innerText =
          "Cloudy";
        document.getElementById("message").innerText =
          "A relaxing day!";

      }

      // Last checked time
      let now = new Date();

      document.getElementById("update").innerText =
        "Last checked: " + now.toLocaleTimeString();

    })

    .catch(function(error) {

      if (thisRequest !== requestId) {
        return;
      }

      document.getElementById("description").innerText =
        "Unable to load weather";

      console.log(error);

    });

}
// Outdoor activity checker
function checkOutside() {

  let result = document.getElementById("outsideResult");

  // Check if weather data is available
  if (currentWeather === null) {

    result.innerText = "Please load the weather first!";
    return;

  }

  let temp = currentWeather.temp;
  let wind = currentWeather.wind;
  let code = currentWeather.code;

  // Bad weather
  if (code >= 95 || temp < -5 || temp > 35) {

    result.innerText =
      "❌ Not the best day to go outside. Stay safe!";

    result.style.background = "#cd2637";

  // Rain, snow or strong wind
  } else if (
    (code >= 51 && code <= 86) || wind > 30
  ) {

    result.innerText =
      "⚠️ Be careful! Bring the right clothes!";

    result.style.background = "#bb7826";

  // Comfortable weather
  } else if (temp >= 10 && temp <= 28) {

    result.innerText =
      "✅ YES! Go out for outdoor activities!";

    result.style.background = "#414c73";

  // Other conditions
  } else {

    result.innerText =
      "😊 You can go outside, but dress for the weather!";

    result.style.background = "#557b9f";

  }

}
getWeather();
